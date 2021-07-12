const cluster = require('cluster');
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');

const createLogger = require('leemons-logger/lib/logger/multiThread');
const { getAvailablePort } = require('leemons-utils/lib/port');

const { createDatabaseManager } = require('leemons-database');
const EventEmitter = require('events');
const { handleStdin } = require('./lib/io');
const { createWorker } = require('./lib/worker');
const { createReloader } = require('./lib/watch');

const { Leemons } = require('../index');
const loadFront = require('../core/plugins/front/loadFront');
const build = require('../core/front/build');
const { loadCoreModels, formatModels } = require('../core/model/loadModel');
const {
  getPluginsInfoFromDB,
  getLocalPlugins,
  getExternalPlugins,
} = require('../core/plugins/getPlugins');
const { loadConfiguration } = require('../core/config/loadConfig');
const { getStatus, PLUGIN_STATUS } = require('./pluginsStatus');
const { computeDependencies, checkMissingDependencies } = require('./dependencies');
const { loadFiles, loadFile } = require('../core/config/loadFiles');

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

    const eventEmitter = new EventEmitter();

    const emit = (event, ...args) => {
      eventEmitter.emit('all', event, ...args);
      eventEmitter.emit(event, ...args);
    };

    // ! Event handling

    let startTime = 0;
    eventEmitter.once('pluginsWillLoad', () => {
      startTime = new Date();
    });
    eventEmitter.once('pluginsDidLoad', () => {
      const time = new Date(new Date() - startTime);
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();
      const milliseconds = time.getMilliseconds();
      const timeString = `${
        (minutes ? `${minutes}min ` : '') + (seconds ? `${seconds}s ` : '')
      }${milliseconds}ms`;

      leemons.log.debug(`Plugins loaded in ${timeString}`);
    });

    // ! App init
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

    // ! Plugin loading
    emit('pluginsWillLoad');
    // Get plugins info from DB and installed plugins (local and external)
    const pluginsInfo = await getPluginsInfoFromDB(leemons);
    const localPlugins = await getLocalPlugins(leemons);
    const externalPlugins = await getExternalPlugins(leemons);
    const pluginsEnv = new Map();

    // Load configuration for each plugin
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
            install: 'install.js',
          },
        });

        // Save the plugin env
        pluginsEnv.set(plugin.path.app, env);
        // pluginsEnv.push([config.get('config.name', plugin.name), env]);

        return {
          source: plugin.source,
          name: config.get('config.name', plugin.name),
          dir: plugin.dir,
          config,
        };
      })
    );

    // Merge DB info with plugins config, if the plugin is missing, create it
    // as missing
    pluginsInfo.forEach(({ name, path: pluginPath, version, id, source, ...pluginInfo }) => {
      const equivalentPlugin = plugins.find(
        (plugin) => plugin.name === name && plugin.dir.app === pluginPath
      );

      // Missing plugin
      if (!equivalentPlugin) {
        plugins.push({
          name,
          source,
          version,
          id,
          dir: { app: pluginPath },
          status: {
            ...getStatus(pluginInfo, PLUGIN_STATUS.missing),
            ...pluginInfo,
          },
        });
        // Existing plugin
      } else {
        equivalentPlugin.id = id;
        equivalentPlugin.status = {
          ...getStatus(pluginInfo, PLUGIN_STATUS.enabled),
          ...pluginInfo,
        };
      }
    });

    // TODO: If a plugin is marked as uninstalled will fail
    // Register new plugins to DB and merge data from DB with config
    plugins = await Promise.all(
      plugins.map(async (plugin, i) => {
        /*
         * Disable duplicated plugins, the duplicated plugins are those which
         * share a name and is not registered in the DB, this last conditions
         * is for ensuring the less posible plugin disabling
         */
        if (
          plugins.findIndex((_plugin, j) => j !== i && plugin.name === _plugin.name) > -1 &&
          plugin.id === undefined
        ) {
          return { ...plugin, status: PLUGIN_STATUS.duplicated };
        }

        // TODO: Can crash
        // If the plugin does not have an id, is not registered in the DB yet
        if (plugin.id === undefined) {
          const {
            name,
            path: pluginPath,
            version,
            id,
            source,
            ...pluginInfo
          } = await leemons.models.plugins.add({
            ...plugin,
            path: plugin.dir.app,
            // Use version 0.0.1 as default
            version: plugin.version || '0.0.1',
          });

          return {
            ...plugin,
            id,
            status: {
              ...getStatus(pluginInfo, PLUGIN_STATUS.enabled),
              ...pluginInfo,
            },
          };
        }

        // Return already registered plugin
        return plugin;
      })
    );

    // TODO: Compute dependencies and dependants
    /**
     * Get for each plugin:
     *  dependencies: The plugins it directly depends on
     *  fullDependencies: All the plugins it depends on (directly or indirectly)
     *  dependants: All the plugins that depends on it (if it fails, the dependants must be disabled)
     */
    plugins = computeDependencies(plugins);

    // Mark each plugin as missingDeps
    const unsatisfiedPlugins = checkMissingDependencies(plugins);
    plugins
      .filter((plugin) => unsatisfiedPlugins.includes(plugin.name))
      .forEach((plugin) => {
        // eslint-disable-next-line no-param-reassign
        plugin.status = { ...plugin.status, ...PLUGIN_STATUS.missingDeps };
      });

    // TODO: LoadPluginsModels

    plugins = await Promise.all(
      plugins.map(async (plugin) => {
        if (plugin.status.code === PLUGIN_STATUS.enabled.code) {
          const models = formatModels(
            await loadFiles(path.join(plugin.dir.app, plugin.dir.models), {
              env: pluginsEnv.get(plugin.dir.app),
            }),
            `plugins.${plugin.name}`
          );
          return { ...plugin, models };
        }
        return plugin;
      })
    );

    leemons.plugins = _.fromPairs(plugins.map((plugin) => [plugin.name, plugin]));
    const pluginsModels = _.merge(
      ...plugins
        .filter((plugin) => plugin.status.code === PLUGIN_STATUS.enabled.code && plugin.models)
        .map((plugin) => plugin.models)
    );

    // Load all the plugins models
    await leemons.db.loadModels(pluginsModels);
    /**
     * Load the models described by each plugin, only if it is enabled
     */

    // TODO:  Install plugins
    const nonInstalledPlugins = plugins.filter(
      (plugin) => !plugin.status.isInstalled && plugin.status.code === PLUGIN_STATUS.enabled.code
    );

    for (let i = 0; i < nonInstalledPlugins.length; i++) {
      const plugin = nonInstalledPlugins[i];
      // Try to install the plugin, if an error occurred, mark the plugin as disabled as well as its dependencies
      try {
        // eslint-disable-next-line no-await-in-loop
        const installResult = await loadFile(path.join(plugin.dir.app, plugin.dir.install));
        // If the installation script exists
        if (installResult !== null) {
          plugin.status.isInstalled = true;
          // eslint-disable-next-line no-await-in-loop
          await leemons.models.plugins.installed(plugin.name);
        }
      } catch (e) {
        // The installation failed, disable plugin
        // eslint-disable-next-line no-param-reassign
        plugin.status = {
          ...plugin.status,
          ...PLUGIN_STATUS.installationFailed,
        };
        // Disable dependant plugins
      }
    }

    console.log(plugins);
    /**
     *        run the installation script for the uninstalled plugins
     */
    // TODO: Load backend
    // TODO:  Initialize plugins (pre)?
    /**
     *        Run a preinitialization where each plugin can set up stuff needed by services and controllers
     */
    // TODO:  Load services
    /**
     *        Load the services; some functions the plugin exposes
     */
    // TODO:  Load controllers
    /**
     *        Load the controllers; functions exposed to the server (endpoints)
     */
    // TODO:  Initialize plugins (post)?
    /**
     *        Run a posInitialization where each plugin can set up stuff needed by other plugins and/or itself. Also, that stuff that relies on itself' services/controllers
     */

    // TODO: Load frontend (start nextjs with child_process instead of next)
    /**
     *        Load the frontend of all the plugins, and reload in secure mode if an error occurs
     */

    emit('pluginsDidLoad');

    // ! Original functions

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
