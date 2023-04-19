/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const execa = require('execa');
const temp = require('temp');
const { loadConfiguration } = require('../config/loadConfig');
const { getPluginsInfoFromDB, getLocalPlugins, getExternalPlugins } = require('./getPlugins');
const { computeDependencies, checkMissingDependencies, sortByDeps } = require('./dependencies');
const { getStatus, PLUGIN_STATUS } = require('./pluginsStatus');
const ScriptLoader = require('./loadScripts');
const transformServices = require('./transformServices');
const { LeemonsSocket } = require('../../socket.io');

// Automatically track and cleanup files at exit
temp.track();

/**
 * Loads all the external files of a type (plugins, providers, etc)
 */
async function loadExternalFiles(leemons, target, singularTarget, VMProperties) {
  leemons.events.emit(`${target}WillLoad`, 'leemons');

  const scriptLoader = new ScriptLoader(target, singularTarget);
  // Get plugins info from DB and installed plugins (local and external)
  const pluginsInfo = await getPluginsInfoFromDB(leemons, target);
  const localPlugins = await getLocalPlugins(leemons, target);
  const externalPlugins = await getExternalPlugins(leemons, singularTarget);

  // Save the environments in a Map
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
          frontend: 'frontend',
          env: '.env',
          install: 'install.js',
          events: 'events.js',
          init: 'init.js',
          load: 'load.js',
        },
      });

      // Save the plugin env
      pluginsEnv.set(plugin.dir.app, {
        HOST: process.env.HOST || process.env.host || 'localhost',
        PORT: process.env.PORT || process.env.port,
        env,
      });

      return {
        source: plugin.source,
        // TODO: Plugin name only can be defined through package.json
        name: config.get('config.name', plugin.name),
        dir: plugin.dir,
        // TODO Sacar version del package.json
        version: '0.0.1',
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
    // TODO: Log whenever a plugin is missing for telemetry and analytics
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
      // Resolve the plugin version from plugin' files (if defined), then from DB
      // and finally the default version
      // TODO: Add version missmatch behaviour (the DB has different version than plugin' files)
      equivalentPlugin.version = equivalentPlugin.version || version || '0.0.1';
      equivalentPlugin.status = {
        ...getStatus(pluginInfo, PLUGIN_STATUS.enabled),
        ...pluginInfo,
      };
    }
  });

  // Register new plugins to DB and merge data from DB with config
  plugins = await Promise.all(
    plugins.map(async (plugin, i) => {
      /*
       * Disable duplicated plugins; the duplicated plugin are those which
       * share a name with another plugin and are is not registered in the DB,
       * this last condition is for ensuring that the less posible plugins
       * are disabled
       */
      if (
        plugins.findIndex((_plugin, j) => j !== i && plugin.name === _plugin.name) > -1 &&
        plugin.id === undefined
      ) {
        return { ...plugin, status: PLUGIN_STATUS.duplicated };
      }

      // TODO: Can crash (When the plugin can't be added to the DB)
      // If the plugin does not have an id, it is not registered in the DB yet
      // so we need to register it
      if (plugin.id === undefined) {
        const {
          name,
          path: pluginPath,
          version,
          id,
          source,
          ...pluginInfo
        } = await leemons.models[target].add({
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

  /**
   * Get for each plugin:
   *  dependencies: The plugins it directly depends on
   *  fullDependencies: All the plugins it depends on (directly or indirectly)
   *  dependants: All the plugins that depends on it (if it fails, the dependants must be disabled)
   */
  plugins = computeDependencies(plugins);
  // Sort by dependencies so the plugins finds all the dependant services loaded
  plugins = sortByDeps(plugins);

  // Check which plugins doesn't have its deps satisfied and mark them as
  // missingDeps
  const unsatisfiedPlugins = checkMissingDependencies(plugins);
  plugins
    .filter((plugin) => unsatisfiedPlugins.includes(plugin.name))
    .forEach((plugin) => {
      _.set(plugin, 'status', { ...plugin.status, ...PLUGIN_STATUS.missingDeps });
    });

  function socketEmit(ids, eventName, eventData) {
    const isSocketIo = (leemons.env.MQTT_PLUGIN || 'mqtt-socket-io') === 'mqtt-socket-io';

    if (isSocketIo) {
      LeemonsSocket.worker.emit(ids, eventName, eventData);
    } else {
      leemons.plugins[leemons.env.MQTT_PLUGIN || 'mqtt-socket-io'].services.socket.worker.emit(
        ids,
        eventName,
        eventData
      );
    }
  }

  function socketEmitToAll(eventName, eventData) {
    const isSocketIo = (leemons.env.MQTT_PLUGIN || 'mqtt-socket-io') === 'mqtt-socket-io';

    if (isSocketIo) {
      LeemonsSocket.worker.emitToAll(eventName, eventData);
    } else {
      leemons.plugins[leemons.env.MQTT_PLUGIN || 'mqtt-socket-io'].services.socket.worker.emitToAll(
        eventName,
        eventData
      );
    }
  }

  // Get each loading function for the plugin
  const pluginsFunctions = plugins
    .filter((plugin) => plugin.status.code === PLUGIN_STATUS.enabled.code)
    .map((plugin) => {
      const env = pluginsEnv.get(plugin.dir.app);

      // Expose some objects to the plugin (leemons.plugin, leemons.getplugin,
      // leemons.query)
      const vmFilter = (filter) => {
        _.set(filter, 'leemons.socket', {
          emit: socketEmit,
          emitToAll: socketEmitToAll,
        });

        _.set(filter, 'leemons.fs', {
          createTempWriteStream: () => {
            if (plugin.name === 'leebrary' && singularTarget === 'plugin')
              return temp.createWriteStream();
            throw new Error('Only the plugin leebrary have access to createTempWriteStream');
          },
          mkTempDir: (...rest) => {
            if (plugin.name === 'leebrary' && singularTarget === 'plugin')
              return temp.mkdir(...rest);
            throw new Error('Only the plugin leebrary have access to mkTempDir');
          },
          openTemp: (...rest) => {
            if (plugin.name === 'leebrary' && singularTarget === 'plugin')
              return temp.open(...rest);
            throw new Error('Only the plugin leebrary have access to open temp files');
          },
        });

        _.set(filter, 'leemons.utils', {
          stopAutoServerReload: () => {
            if (target === 'plugins' && plugin.name === 'package-manager') {
              leemons.canReloadFrontend = false;
              leemons.canReloadBackend = false;
              if (leemons.stopAutoReloadWorkers) leemons.stopAutoReloadWorkers();
              return true;
            }
            throw new Error('Only the plugin package-manager have access to stopAutoServerReload');
          },
          startAutoServerReload: () => {
            if (target === 'plugins' && plugin.name === 'package-manager') {
              leemons.canReloadFrontend = true;
              leemons.canReloadBackend = true;
              if (leemons.startAutoReloadWorkers) leemons.startAutoReloadWorkers();
              return true;
            }
            throw new Error('Only the plugin package-manager have access to startAutoServerReload');
          },
          reloadServer: () => {
            if (target === 'plugins' && plugin.name === 'package-manager') {
              leemons.reloadWorkers();
              return true;
            }
            throw new Error('Only the plugin package-manager have access to reloadServer');
          },
          getExeca: () => {
            if (target === 'plugins' && plugin.name === 'package-manager') return execa;
            throw new Error('Only the plugin package-manager have access to execa');
          },
        });

        // Only let the plugin to emit events on itself
        _.set(filter, 'leemons.events', {
          emit: (event, ...args) => leemons.events.emit(event, `${target}.${plugin.name}`, ...args),
          once: (...args) => leemons.events.once(...args),
          on: (...args) => leemons.events.on(...args),
        });

        // Expose leemons.plugin, leemons.provider... to each external file+
        _.set(filter, `leemons.${singularTarget}`, plugin);
        _.set(
          filter,
          `leemons.${singularTarget}.prefixPN`,
          (str) => `${target}.${plugin.name}.${str}`
        );

        // TODO: Convert the plugins array to a Map for more efficiency
        // Expose leemons.getPlugin, leemons.getProvider... to each external file
        const getPluggable = (pluggables) => (pluggableName) => {
          // Remove plugins properties from the called pluggable due to security reasons
          const secureDesiredPlugin = (_plugin) => {
            const desiredPlugin = _.pick(_plugin, ['name', 'version', 'services']);
            desiredPlugin.services = transformServices(
              desiredPlugin.services,
              `${target}.${plugin.name}`
            );
            return desiredPlugin;
          };

          let _pluggables = pluggables;

          // If the handler is a function, call it first
          if (_.isFunction(_pluggables)) {
            // eslint-disable-next-line no-param-reassign
            _pluggables = _pluggables(plugin, pluggableName);

            // If the handler desires to handle everything itself, must return a function
            if (_.isFunction(_pluggables)) {
              return _pluggables(secureDesiredPlugin);
            }
          }

          // If the handler is a string, get it from leemons global object
          if (_.isString(_pluggables)) {
            // eslint-disable-next-line no-param-reassign
            _pluggables = leemons[_pluggables];
          }

          // If the handler is the object itself, handle by default handler
          if (_.isArray(_pluggables)) {
            const desiredPluggable = _pluggables.find(
              (pluggable) =>
                pluggable.name === pluggableName &&
                pluggable.status.code === PLUGIN_STATUS.enabled.code
            );

            if (desiredPluggable) {
              return secureDesiredPlugin(desiredPluggable);
            }
          }

          return null;
        };

        // Get which pluggable getters should be exposed
        const pluggables = Object.entries(VMProperties);
        pluggables.push([
          `get${singularTarget.charAt(0).toUpperCase()}${singularTarget.substr(1)}`,
          plugins,
        ]);

        // Expose each pluggable getter
        pluggables.forEach(([name, value]) => {
          _.set(filter, `leemons.${name}`, getPluggable(value));
        });

        const { query } = filter.leemons;
        _.set(filter, 'leemons.query', (modelName) => query(modelName, plugin.name));

        _.set(filter, 'leemons.cache', leemons.cache(plugin.name));

        return filter;
      };

      const load = () => scriptLoader.customLoad(plugin, env, vmFilter);
      const models = () => scriptLoader.loadModels(plugins, plugin, env, vmFilter);
      const install = () => scriptLoader.loadInstall(plugins, plugin, env, vmFilter);
      const init = () => scriptLoader.loadInit(plugins, plugin, env, vmFilter);
      const services = () => scriptLoader.loadServices(plugins, plugin, env, vmFilter);
      const routes = () => scriptLoader.loadRoutes(plugins, plugin, env, vmFilter);
      const controllers = () => scriptLoader.loadControllers(plugins, plugin, env, vmFilter);
      const events = () => scriptLoader.loadEvents(plugins, plugin, env, vmFilter);

      return {
        plugin,
        scripts: {
          load,
          models,
          install,
          init,
          services,
          routes,
          controllers,
          events,
        },
      };
    });

  // Load each plugin
  // const pluginsLength = pluginsFunctions.length;

  const startTime = new Date();
  leemons.events.once(`${target}DidLoad`, () => {
    const now = new Date();
    const time = new Date(now - startTime);
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();
    const timeString = `${(minutes ? `${minutes}min ` : '') + (seconds ? `${seconds}s ` : '')
      }${milliseconds}ms`;

    leemons.log.debug(`${target} loaded in ${timeString}`);
  });

  await Promise.all(pluginsFunctions.map((plugin) => plugin.scripts.events()));

  // for (let i = 0; i < pluginsLength; i++) {
  async function loadPlugin(i) {
    const { plugin, scripts } = pluginsFunctions[i] || {};

    if (plugin && !plugin.status.didLoad) {
      // If no plugin depends on it load it asynchronously
      if (!plugin.dependencies.dependants.length) {
        loadPlugin(i + 1);
      }
      plugin.status.didLoad = true;
      /**
       * Keep track on everything a plugin should load, so in case a custom loader
       * exists, everything is loaded correctly
       */
      const loadStatus = {
        models: false,
        installed: false,
        services: false,
        init: false,
        controllers: false,
        routes: false,
      };
      plugin.status.loadStatus = loadStatus;

      leemons.events.once(`${target}.${plugin.name}:${singularTarget}DidLoadModels`, () => {
        loadStatus.models = true;
      });
      leemons.events.once(`${target}.${plugin.name}:${singularTarget}DidInstall`, () => {
        loadStatus.installed = true;
      });
      leemons.events.once(`${target}.${plugin.name}:${singularTarget}DidLoadServices`, () => {
        loadStatus.services = true;
      });
      leemons.events.once(`${target}.${plugin.name}:${singularTarget}DidInit`, () => {
        loadStatus.init = true;
      });
      leemons.events.once(`${target}.${plugin.name}:${singularTarget}DidLoadControllers`, () => {
        loadStatus.controllers = true;
      });
      leemons.events.once(`${target}.${plugin.name}:${singularTarget}DidLoadRoutes`, () => {
        loadStatus.routes = true;
      });

      const load = await scripts.load();
      if (load.exists) {
        await load.func({
          scripts: _.omit(scripts, ['load']),
          next: () => loadPlugin(i + 1),
          isInstalled: plugin.status.isInstalled,
        });
      }

      if (!loadStatus.models) {
        await scripts.models();
      }

      /**
       * Run the installation script for the uninstalled plugins
       */
      if (
        !loadStatus.installed &&
        !plugin.status.isInstalled &&
        plugin.status.code === PLUGIN_STATUS.enabled.code
      ) {
        await scripts.install();
      }

      /**
       * Load the services; some functions the plugin exposes
       */
      if (!loadStatus.services) {
        await scripts.services();
      }
      /**
       * Run the initialization script once the services are loaded
       */
      if (!loadStatus.init) {
        await scripts.init();
      }
      /**
       * Load the controllers; functions exposed to the server (endpoints)
       */
      if (!loadStatus.controllers) {
        await scripts.controllers();
      }
      if (!loadStatus.routes) {
        await scripts.routes();
      }
      if (plugin.status.code === PLUGIN_STATUS.enabled.code) {
        leemons.events.emit(`${singularTarget}DidLoad`, `${target}.${plugin.name}`);
      }
      await loadPlugin(i + 1);
    }
  }

  /**
   * As soon as a plugin calls `next()` without awaiting it, the following
   * plugins are not waited by leemons in order to continue loading the app,
   * resulting in crashes, bugs and errors, so we need to wait unitl all the
   * plugins are loaded (have emitted pluginDidLoad)
   */
  async function waitPluginsLoad() {
    return new Promise((resolve) => {
      // Create a Map with all the plugins that needs loading
      const remainingPlugins = new Map();
      pluginsFunctions.forEach(({ plugin }) =>
        remainingPlugins.set(`${target}.${plugin.name}`, plugin)
      );
      if (remainingPlugins.size === 0) {
        resolve();
      }

      const eventHandler = ({ target: eventTarget }) => {
        remainingPlugins.delete(eventTarget);
        // When no remaininingPlugins to be loaded, then the plugins are loaded
        if (remainingPlugins.size === 0) {
          leemons.events.off(`${singularTarget}DidLoad`, eventHandler);
          leemons.events.off(`${singularTarget}DidDisable`, eventHandler);
          resolve();
        }
      };

      // When a plugin is fully loaded, remove it from the Map
      leemons.events.on(`${singularTarget}DidLoad`, eventHandler);
      // When a plugin is disabled, remove it from the Map
      leemons.events.on(`${singularTarget}DidDisable`, eventHandler);
    });
  }

  await Promise.all([waitPluginsLoad(), loadPlugin(0)]);
  leemons.events.emit(`${target}DidLoad`, 'leemons');

  // Save the enabled plugins on leemons
  _.set(leemons, target, _.fromPairs(pluginsFunctions.map(({ plugin }) => [plugin.name, plugin])));

  return pluginsFunctions.map(({ plugin }) => plugin);
}

module.exports = {
  loadExternalFiles,
};
