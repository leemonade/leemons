/* eslint-disable no-await-in-loop */
const path = require('path');
const _ = require('lodash');

const { loadConfiguration } = require('../core/config/loadConfig');
const { loadFiles } = require('../core/config/loadFiles');
const { formatModels } = require('../core/model/loadModel');
const {
  getPluginsInfoFromDB,
  getLocalPlugins,
  getExternalPlugins,
} = require('../core/plugins/getPlugins');
const { computeDependencies, checkMissingDependencies, sortByDeps } = require('./dependencies');
const { getStatus, PLUGIN_STATUS } = require('./pluginsStatus');
const {
  loadServices,
  loadInstall,
  loadInit,
  loadRoutes,
  loadControllers,
  customLoad,
} = require('./loadScripts');

/**
 * Get all the services which are a function and wrap them, so this.calledFrom is added to the call
 */
function transformServices(services, calledFrom) {
  const _services = _.cloneDeep(services);
  const wrap = (func) => (...params) => func.call({ calledFrom }, ...params);

  _.forEach(_.keys(services), (serviceKey) => {
    // If the service is a function, call it with custom context
    if (_.isFunction(services[serviceKey])) {
      _services[serviceKey] = wrap(services[serviceKey]);
      // If the service is an object
    } else if (_.isObject(services[serviceKey])) {
      _.forEach(_.keys(services[serviceKey]), (propertyKey) => {
        // Check if the property is a function and call it with custom context
        if (_.isFunction(services[serviceKey][propertyKey])) {
          _services[serviceKey][propertyKey] = wrap(services[serviceKey][propertyKey]);
        }
      });
    }
  });
  return _services;
}

async function loadExternalFiles(leemons) {
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
          init: 'init.js',
          load: 'load.js',
        },
      });

      // Save the plugin env
      pluginsEnv.set(plugin.dir.app, env);

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
      equivalentPlugin.version = equivalentPlugin.version || version || '0.0.1';
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

  /**
   * Get for each plugin:
   *  dependencies: The plugins it directly depends on
   *  fullDependencies: All the plugins it depends on (directly or indirectly)
   *  dependants: All the plugins that depends on it (if it fails, the dependants must be disabled)
   */
  plugins = computeDependencies(plugins);
  plugins = sortByDeps(plugins);

  // Mark each plugin as missingDeps
  const unsatisfiedPlugins = checkMissingDependencies(plugins);
  plugins
    .filter((plugin) => unsatisfiedPlugins.includes(plugin.name))
    .forEach((plugin) => {
      _.set(plugin, 'status', { ...plugin.status, ...PLUGIN_STATUS.missingDeps });
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

  _.set(leemons, 'plugins', _.fromPairs(plugins.map((plugin) => [plugin.name, plugin])));
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

  const pluginsFunctions = plugins
    .filter((plugin) => plugin.status.code === PLUGIN_STATUS.enabled.code)
    .map((plugin) => {
      const env = pluginsEnv.get(plugin.dir.app);

      const vmFilter = (filter) => {
        _.set(filter, 'leemons.plugin', plugin);

        _.set(filter, 'leemons.getPlugin', (pluginName) => {
          let desiredPlugin = plugins.find(
            (_plugin) =>
              _plugin.name === pluginName && _plugin.status.code === PLUGIN_STATUS.enabled.code
          );

          if (desiredPlugin) {
            desiredPlugin = _.pick(desiredPlugin, ['name', 'version', 'services']);
            desiredPlugin.services = transformServices(
              desiredPlugin.services,
              `plugins.${plugin.name}`
            );
            return desiredPlugin;
          }
          return null;
        });

        const { query } = filter.leemons;
        _.set(filter, 'leemons.query', (modelName) => query(modelName, plugin.name));

        return filter;
      };

      const load = () => customLoad(plugins, plugin, env, vmFilter);
      const install = () => loadInstall(plugins, plugin, env, vmFilter);
      const init = () => loadInit(plugins, plugin, env, vmFilter);
      const services = () => loadServices(plugins, plugin, env, vmFilter);
      const routes = () => loadRoutes(plugins, plugin, env, vmFilter);
      const controllers = () => loadControllers(plugins, plugin, env, vmFilter);

      return {
        plugin,
        scripts: {
          load,
          install,
          init,
          services,
          routes,
          controllers,
        },
      };
    });

  const pluginsLength = pluginsFunctions.length;
  for (let i = 0; i < pluginsLength; i++) {
    const { plugin } = pluginsFunctions[i];
    const { scripts } = pluginsFunctions[i];

    /**
     * Keep track on everything a plugin should load, so in case a custom loader
     * exists, everything is loaded correctly
     */
    const loadStatus = {
      installed: false,
      services: false,
      init: false,
      controllers: false,
      routes: false,
    };

    leemons.events.once(`plugins.${plugin.name}:pluginDidInstall`, () => {
      loadStatus.installed = true;
    });
    leemons.events.once(`plugins.${plugin.name}:pluginDidLoadedServices`, () => {
      loadStatus.services = true;
    });
    leemons.events.once(`plugins.${plugin.name}:pluginDidInit`, () => {
      loadStatus.init = true;
    });
    leemons.events.once(`plugins.${plugin.name}:pluginDidLoadedControllers`, () => {
      loadStatus.controllers = true;
    });
    leemons.events.once(`plugins.${plugin.name}:pluginDidLoadedRoutes`, () => {
      loadStatus.routes = true;
    });

    const load = await scripts.load();
    if (load.exists) {
      await load.func({ scripts: _.omit(scripts, ['load']) });
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
  }

  // TODO: Load frontend (start nextjs with child_process instead of next)
  /**
   *        Load the frontend of all the plugins, and reload in secure mode if an error occurs
   */
}

module.exports = {
  loadExternalFiles,
};
