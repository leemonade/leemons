const apm = require('leemons-telemetry').start(process.env.leemons_telemetry_name ?? 'Leemons App');
const fs = require('fs-extra');

const cluster = require('cluster');
const path = require('path');
const chalk = require('chalk');

const createLogger = require('leemons-logger/lib/logger/multiThread');
const { getAvailablePort } = require('leemons-utils/lib/port');
const { Leemons } = require('../index');

const { handleStdin } = require('./lib/io');
const { createWorker } = require('./lib/worker');
const { createReloader } = require('./lib/watch');

const loadFront = require('../core/plugins/front/loadFront');
const build = require('../core/front/build');
const { PLUGIN_STATUS } = require('../core/plugins/pluginsStatus');
const { LeemonsSocket } = require('../socket.io');

// TODO falta que al reiniciar los servidores manualmente se haga bien añadiendo o quitando a los watchers los nuevos plugins.

/**
 * Creates a watcher for frontend files and then sets up all the needed files
 */
async function setupFront(leemons, plugins, providers, frontendDir) {
  // Frontend directories to watch for changes
  const frontDirs = [
    // App frontend/** directories
    path.join(
      path.isAbsolute(leemons.dir.frontend)
        ? leemons.dir.frontend
        : path.join(leemons.dir.app, leemons.dir.frontend),
      '**'
    ),
    // Plugin frontend/** directories
    ...plugins.map((plugin) =>
      path.join(
        path.isAbsolute(plugin.dir.frontend)
          ? plugin.dir.frontend
          : path.join(plugin.dir.app, plugin.dir.frontend),
        '**'
      )
    ),
    // Provider frontend/** directories
    ...providers.map((provider) =>
      path.join(
        path.isAbsolute(provider.dir.frontend)
          ? provider.dir.frontend
          : path.join(provider.dir.app, provider.dir.frontend),
        '**'
      )
    ),
  ];

  // Make first front load
  await leemons.loadFront(plugins, providers);

  const handler = async () => {
    await loadFront(leemons, plugins, providers);
    await build();
  };

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
         *  frontend/dependencies
         *  frontend/plugins
         *  frontend/pages
         *  frontend/jsconfig.json
         */
        `${frontendDir}/(dependencies|plugins|pages|jsconfig.json)/**`,
        /.*checksums.json.*/,
      ],
    },
    // When a change occurs, reload front
    handler: async () => {
      if (leemons.canReloadFrontend) {
        await handler();
      }
    },
    logger: leemons.log,
  });
  return { handler };
}

/**
 * Creates a watcher for backend files and then sets up all the needed services
 */
async function setupBack(leemons) {
  // Load backend for first time
  const { plugins, providers } = await leemons.loadBack();

  // Keep plugins and providers separated because they can need different files
  // to be watched
  const pluginsDirs = plugins.map((plugin) => path.join(plugin.dir.app, '**'));
  const providersDirs = providers.map((provider) => path.join(provider.dir.app, '**'));

  // Ignore plugins frontend and config folders (they are handled by other services)
  const ignoredPluginsDirs = plugins.map((plugin) => {
    const pluginUnwatchedDirs = plugin.config.config?.unwatchedDirs || [];

    const allIgnoredDirs = [plugin.dir.config, plugin.dir.frontend, ...pluginUnwatchedDirs];

    return path.join(plugin.dir.app, `(${allIgnoredDirs.join('|')})`, '**');
  });

  // Ignore providers frontend and config folders (they are handled by other services)

  const ignoredProvidersDirs = providers.map((provider) => {
    const providerUnwatchedDirs = provider.config.config?.unwatchedDirs || [];

    const allIgnoredDirs = [provider.dir.config, provider.dir.frontend, ...providerUnwatchedDirs];

    return path.join(provider.dir.app, `(${allIgnoredDirs.join('|')})`, '**');
  });

  const handler = async () => {
    leemons.setEvents();
    // eslint-disable-next-line no-param-reassign
    leemons.backRouter.stack = [];
    await leemons.db.destroy();
    return leemons.loadBack();
  };

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
     * When a change occurs, remove backend router endpoints, destroy DB
     * connection and load back again
     */
    handler: async () =>
      new Promise((resolve, reject) => {
        if (leemons.canReloadBackend) {
          if (leemons.events) {
            leemons.events.once('appWillReload', async () => {
              handler().then(resolve).catch(reject);
            });

            leemons.events.emit('appWillReload');
          } else {
            handler().then(resolve).catch(reject);
          }
        }
      }),
    logger: leemons.log,
  });

  return { plugins, providers, handler };
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
      // ignore leemons plugins, connectors and frontend dirs
      path.join(__dirname, '../../../leemons-!(plugin|connector|provider|react)**'),
      path.join(__dirname, '../../../leemons/**'),
    ];

    // Gets the first free port (starting at process.env.PORT)
    const PORT = await getAvailablePort();

    // Create a multi-thread logger
    const logger = await createLogger();
    logger.level = logLevel;

    let canReloadWorkers = true;

    function emitToAllWorkers(callback) {
      Object.values(cluster.workers).forEach((worker) => {
        callback(worker);
      });
    }

    function reloadWorkers() {
      emitToAllWorkers((worker) => worker.send('kill'));
      createWorker({ PORT, loggerId: logger.id, loggerLevel: logger.level });
    }

    LeemonsSocket.main.init();

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
        case 'stop-auto-reload':
          canReloadWorkers = false;
          break;
        case 'start-auto-reload':
          canReloadWorkers = true;
          break;
        case 'reload-workers':
          emitToAllWorkers((worker) => worker.send('reload-back-front'));
          break;
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
        if (canReloadWorkers) {
          reloadWorkers();
        }
      },
      logger,
    });

    // Creates the first worker (which will host the leemons app)
    createWorker({ PORT, loggerId: logger.id, loggerLevel: logger.level });
  } else if (cluster.isWorker) {
    let setUpFront;
    let setUpBack;
    // Set the thread process title (visible in $ ps)
    process.title = 'Leemons Dev Instance';
    // Sets the environment to development
    process.env.NODE_ENV = 'development';

    // Creates the worker multi-thread logger (emits logs to master)
    const log = await createLogger();
    log.level = process.env.loggerLevel;

    // Starts the application (Config)
    const leemons = new Leemons(log);

    leemons.stopAutoReloadWorkers = () => {
      process.send({ message: 'stop-auto-reload' });
    };
    leemons.startAutoReloadWorkers = () => {
      process.send({ message: 'start-auto-reload' });
    };
    leemons.reloadWorkers = () => {
      process.send({ message: 'reload-workers' });
    };

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
          leemons.events.once('appWillReload', () => {
            leemons.server.destroy(() => {
              process.send({ ...message, message: 'killed' });
            });
          });
          leemons.events.emit('appWillReload');

          break;
        case 'reload-back-front':
          (async () => {
            await setUpBack();
            // TODO: ADD NEW FRONT LOGIC
            // await setUpFront();
          })();
          break;
        default:
      }
    });

    // Loads the App and plugins config
    await leemons.loadAppConfig();

    const { plugins, providers, handler: backHandler } = await setupBack(leemons);
    setUpBack = backHandler;

    leemons.enabledPlugins = plugins.filter(
      (plugin) => plugin.status.code === PLUGIN_STATUS.enabled.code
    );
    leemons.enabledProviders = providers.filter(
      (provider) => provider.status.code === PLUGIN_STATUS.enabled.code
    );
    /*
     * Load all the frontend plugins, build the app if needed
     * and set the middlewares.
     */

    // TODO: ADD NEW FRONT LOGIC
    leemons.setFrontRoutes();
    // let frontendDir = leemons.config.get('config.dir.frontend', 'frontend');
    // frontendDir = path.isAbsolute(frontendDir) ? frontendDir : path.join(cwd, frontendDir);
    // const { handler: frontHandler } = await setupFront(
    //   leemons,
    //   leemons.enabledPlugins,
    //   leemons.enabledProviders,
    //   frontendDir
    // );
    // setUpFront = frontHandler;

    leemons.loaded = true;

    // Start listening once all is loaded
    await leemons.start();
  }
};
