const cluster = require('cluster');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');

const createLogger = require('leemons-logger/lib/logger/multiThread');
const { getAvailablePort } = require('leemons-utils/lib/port');

const { createDatabaseManager } = require('leemons-database');
const { handleStdin } = require('./lib/io');
const { createWorker } = require('./lib/worker');
const { createReloader } = require('./lib/watch');

const { Leemons } = require('../index');
const loadFront = require('../core/plugins/front/loadFront');
const build = require('../core/front/build');
const { loadCoreModels } = require('../core/model/loadModel');
const {
  getPluginsInfoFromDB,
  getLocalPlugins,
  getExternalPlugins,
} = require('../core/plugins/getPlugins');
const { loadConfiguration } = require('../core/config/loadConfig');

/**
 * Creates a watcher for frontend files and then sets up all the needed files
 */
async function setupFront(leemons, plugins, providers, nextDir) {
  // Frontend directories to watch for changes
  const frontDirs = [
    // App next/** directories
    path.join(
      path.isAbsolute(leemons.dir.next)
        ? leemons.dir.next
        : path.join(leemons.dir.app, leemons.dir.next),
      '**'
    ),
    // Plugin next/** directories
    ...plugins.map((plugin) =>
      path.join(
        path.isAbsolute(plugin.dir.next)
          ? plugin.dir.next
          : path.join(plugin.dir.app, plugin.dir.next),
        '**'
      )
    ),
    // Provider next/** directories
    ...providers.map((provider) =>
      path.join(
        path.isAbsolute(provider.dir.next)
          ? provider.dir.next
          : path.join(provider.dir.app, provider.dir.next),
        '**'
      )
    ),
  ];

  // Make first front load
  await leemons.loadFront(plugins, providers);

  // Create a file watcher
  createReloader({
    name: 'Frontend',
    dirs: frontDirs,
    config: {
      ignoreInitial: true,
      ignored: [
        /(^|[/\\])\../, // ignore dotfiles
        /.*node_modules.*/,
        'yarn.lock',
        /*
         * Ignore:
         *  next/dependencies
         *  next/plugins
         *  next/pages
         *  next/jsconfig.json
         */
        `${nextDir}/(dependencies|plugins|pages|jsconfig.json)/**`,
        /.*checksums.json.*/,
      ],
    },
    // When a change occurs, reload front
    handler: async () => {
      await loadFront(leemons, plugins, providers);
      await build();
    },
    logger: leemons.log,
  });
}

/**
 * Creates a watcher for backend files and then sets up all the needed services
 */
async function setupBack(leemons, plugins, providers) {
  /*
   * Backend directories to watch for changes
   *  plugin.dir.models
   *  plugin.dir.controllers
   *  plugin.dir.services
   */
  const pluginsDirs = plugins.map((plugin) => path.join(plugin.dir.app, '**'));

  // Ignore plugins frontend and config folders (they are handled by other services)
  const ignoredPluginsDirs = plugins.map((plugin) =>
    path.join(
      plugin.dir.app,
      `\
(${plugin.dir.config}|\
${plugin.dir.next})`,
      '**'
    )
  );

  const providersDirs = providers.map((provider) => path.join(provider.dir.app, '**'));

  // Ignore providers frontend and config folders (they are handled by other services)
  const ignoredProvidersDirs = plugins.map((plugin) =>
    path.join(
      plugin.dir.app,
      `\
(${plugin.dir.config}|\
${plugin.dir.next})`,
      '**'
    )
  );

  // Load backend for first time
  await leemons.loadBack(plugins, providers);

  // Create a backend watcher
  createReloader({
    name: 'Backend',
    dirs: [...pluginsDirs, ...providersDirs],
    config: {
      ignoreInitial: true,
      ignored: [
        /(^|[/\\])\../, // ignore dotfiles
        /.*node_modules.*/,
        ...ignoredPluginsDirs,
        ...ignoredProvidersDirs,
      ],
    },
    /*
     * When a change occurs, remove backend router endpoints
     * and load back again
     */
    handler: () => {
      // eslint-disable-next-line no-param-reassign
      leemons.backRouter.stack = [];
      return leemons.loadBack(plugins, providers);
    },
    logger: leemons.log,
  });
}

module.exports = async ({ level: logLevel = 'debug' }) => {
  const cwd = process.cwd();

  if (cluster.isMaster) {
    // Set the master process title (visible in $ ps)
    process.title = 'Leemons Dev';

    // Resolve the config_dir
    const configDir = process.env.CONFIG_DIR || 'config';

    // Global directories to watch for changes
    const paths = [
      // Application config directory
      configDir,
      // Application package.json
      path.join(cwd, 'package.json'),
      // ignore leemons plugins and connectors
      path.join(__dirname, '../../../leemons-!(plugin|connector|provider)**'),
      path.join(__dirname, '../../../leemons/**'),
    ];

    // Gets the first free port (starting at process.env.PORT)
    const PORT = await getAvailablePort();

    // Create a multi-thread logger
    const logger = await createLogger();
    logger.level = logLevel;

    /*
     * Thread communication listener
     *
     * Kill:
     *  When a child process emits a kill event, the master process will kill it.
     */
    cluster.on('message', (worker, _message) => {
      let message = _message;
      if (typeof _message === 'string') {
        message = { message: _message };
      }
      switch (message.message) {
        case 'kill':
          worker.send({ ...message, message: 'kill' });
          break;
        case 'killed':
          worker.kill();
          if (message.error) {
            // eslint-disable-next-line no-console
            console.error(chalk`{green An error occurred, type "rs\\n" for restart the process}\n`);
          }
          break;
        default:
      }
    });

    // Handles CLI interaction commands (such as screen cleaning [ctrl + l])
    handleStdin(PORT, logger);

    createReloader({
      name: 'Leemons',
      dirs: paths,
      config: {
        cwd,
        ignored: /(^|[/\\])\../, // ignore dotfiles
        ignoreInitial: true,
      },
      // When a change is detected, kill all the workers and fork a new one
      handler: async () => {
        Object.values(cluster.workers).forEach((worker) => {
          worker.send('kill');
        });
        createWorker({ PORT, loggerId: logger.id, loggerLevel: logger.level });
      },
      logger,
    });

    // Creates the first worker (which will host the leemons app)
    createWorker({ PORT, loggerId: logger.id, loggerLevel: logger.level });
  } else if (cluster.isWorker) {
    // Set the thread process title (visible in $ ps)
    process.title = 'Leemons Dev Instance';
    // Sets the environment to development
    process.env.NODE_ENV = 'development';

    // Creates the worker multi-thread logger (emits logs to master)
    const log = await createLogger();
    log.level = process.env.loggerLevel;

    // Starts the application (Config)
    const leemons = new Leemons(log);

    /*
     * Thread communication listener
     *
     * Kill:
     *  When the master emits a kill event, clean the Leemons instance and exit.
     */
    cluster.worker.on('message', (_message) => {
      let message = _message;
      if (typeof _message === 'string') {
        message = { message: _message };
      }

      switch (message.message) {
        case 'kill':
          leemons.server.destroy(() => {
            process.send({ ...message, message: 'killed' });
          });
          break;
        default:
      }
    });

    // Loads the App and plugins config
    await leemons.loadAppConfig();

    /*
     * Create a DatabaseManager for managing the database connections and models
     */
    leemons.db = createDatabaseManager(leemons);
    /*
     * Initialize database connections
     */
    await leemons.db.init();

    /**
     * Load core models
     */
    loadCoreModels(leemons);
    await leemons.db.loadModels(_.omit(leemons.models, 'core_store'));

    const pluginsInfo = await getPluginsInfoFromDB(leemons);
    const localPlugins = await getLocalPlugins(leemons);
    const externalPlugins = await getExternalPlugins(leemons);

    let plugins = await Promise.all(
      [...localPlugins, ...externalPlugins].map(async (plugin) => {
        const { env, configProvider: config } = await loadConfiguration(plugin, {
          dir: plugin.path,
          defaultDirs: {
            config: 'config',
            models: 'models',
            controllers: 'controllers',
            services: 'services',
            providers: 'providers',
            next: 'next',
            env: '.env',
          },
        });

        // Save the plugin env
        // pluginsEnv.push([config.get('config.name', plugin.name), env]);

        return {
          source: plugin.source,
          name: config.get('config.name', plugin.name),
          dir: plugin.dir,
          config,
        };
      })
    );

    const getStatus = (pluginInfo, defaultStatus) => {
      if (pluginsInfo.isDisabled) {
        return {
          code: 'disabled',
          reason: 'disabled by admin',
        };
      }
      if (pluginsInfo.isBroken) {
        return {
          code: 'broken',
          reason: 'the plugin initialization failed',
        };
      }

      return defaultStatus;
    };

    pluginsInfo.forEach(({ name, path: pluginPath, version, id, source, ...pluginInfo }) => {
      const equivalentPlugin = plugins.find(
        (plugin) => plugin.name === name && plugin.dir.app === pluginPath
      );

      if (!equivalentPlugin) {
        plugins.push({
          name,
          // TODO: Save source
          source,
          version,
          id,
          dir: { app: pluginPath },
          status: {
            ...getStatus(pluginInfo, {
              code: 'missing',
              reason: 'The plugin is registered but its files are missing',
            }),
            ...pluginInfo,
          },
        });
      } else {
        equivalentPlugin.id = id;
        equivalentPlugin.status = {
          // TODO: Support not enabled statuses
          ...getStatus(pluginInfo, { code: 'enabled', reason: '' }),
          ...pluginInfo,
        };
      }
    });

    console.log(plugins);
    // Register new plugins to DB
    plugins = await Promise.all(
      plugins.map(async (plugin) => {
        if (plugin.id === undefined) {
          await leemons.models.plugins.add({
            ...plugin,
            path: plugin.dir.app,
            version: plugin.version || '0.0.1',
          });
        }
      })
    );

    // const pluginsConfig = await leemons.loadPluginsConfig();
    // const providersConfig = await leemons.loadProvidersConfig();

    // let nextDir = leemons.config.get('config.dir.next', 'next');
    // nextDir = path.isAbsolute(nextDir) ? nextDir : path.join(cwd, nextDir);

    // // Start the Front and Back services
    // await Promise.all([
    //   setupFront(leemons, pluginsConfig, providersConfig, nextDir),
    //   setupBack(leemons, pluginsConfig, providersConfig),
    // ]);

    leemons.loaded = true;

    // Start listening once all is loaded
    await leemons.start();
  }
};
