/* eslint-disable no-await-in-loop */
const path = require('path');
const _ = require('lodash');

const { loadConfiguration } = require('../core/config/loadConfig');
const { loadFiles, loadFile } = require('../core/config/loadFiles');
const { formatModels } = require('../core/model/loadModel');
const {
  getPluginsInfoFromDB,
  getLocalPlugins,
  getExternalPlugins,
} = require('../core/plugins/getPlugins');
const { computeDependencies, checkMissingDependencies, sortByDeps } = require('./dependencies');
const { getStatus, PLUGIN_STATUS } = require('./pluginsStatus');

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

/**
 * Disables the given plugin and also it's dependants
 */
function disablePlugin(plugins, plugin, reason = PLUGIN_STATUS.initializationFailed) {
  _.set(plugin, 'status', { ...plugin.status, ...reason });

  const { dependants } = plugin.dependencies;

  plugins
    .filter((_plugin) => dependants.includes(_plugin.name))
    .forEach((_plugin) => disablePlugin(plugins, _plugin, PLUGIN_STATUS.disabledDeps));
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

  // TODO: Compute dependencies and dependants
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
        // TODO: Expose the other plugins

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

      // TODO: Move to loader functions and add events
      const load = () =>
        loadFile(path.join(plugin.dir.app, plugin.dir.load), {
          env,
          filter: vmFilter,
          allowedPath: plugin.dir.app,
        });

      const installation = () =>
        loadFile(path.join(plugin.dir.app, plugin.dir.install), {
          env,
          allowedPath: plugin.dir.app,
        });

      const init = () =>
        loadFile(path.join(plugin.dir.app, plugin.dir.init), {
          env,
          allowedPath: plugin.dir.app,
          filter: vmFilter,
        });

      const services = () =>
        loadFiles(path.join(plugin.dir.app, plugin.dir.services), {
          execFunction: false,
          env,
          filter: vmFilter,
          allowedPath: plugin.dir.app,
        });

      const routesDir = path.join(plugin.dir.app, plugin.dir.controllers, 'routes');
      // Try to load routes.js, if not exists, load routes.json, if none exists, set the routes to empty array
      const routes = async () =>
        (await loadFile(`${routesDir}.js`, { env })) ||
        (await loadFile(`${routesDir}.json`, { env })) ||
        [];

      const controllers = () =>
        loadFiles(path.join(plugin.dir.app, plugin.dir.controllers), {
          env,
          // Do not load the routes again
          exclude: [`${routesDir}.js`, `${routesDir}.json`],
          filter: vmFilter,
        });

      return {
        plugin,
        scripts: {
          load,
          installation,
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

    // TODO: Only load those plugin which are enabled (check per scripts)

    // Install uninstalled plugins
    if (!plugin.status.isInstalled && plugin.status.code === PLUGIN_STATUS.enabled.code) {
      try {
        await scripts.installation();
        // Set as installed even though the script does not exists
        plugin.status.isInstalled = true;
        await leemons.models.plugins.installed(plugin.name);
      } catch (e) {
        // The installation failed, disable plugin
        disablePlugin(plugins, plugin, PLUGIN_STATUS.installationFailed);
      }
    }

    await scripts.init();

    // TODO: Expose leemons
    plugin.services = await scripts.services();
    await scripts.init();
    plugin.controllers = await scripts.controllers();
    plugin.routes = await scripts.routes();
  }
  // // TODO:  Install plugins
  // const nonInstalledPlugins = plugins.filter(
  //   (plugin) => !plugin.status.isInstalled && plugin.status.code === PLUGIN_STATUS.enabled.code
  // );

  // await installPlugins(nonInstalledPlugins);

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
}

module.exports = {
  loadExternalFiles,
};
