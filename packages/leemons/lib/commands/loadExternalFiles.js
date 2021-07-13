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
const { computeDependencies, checkMissingDependencies } = require('./dependencies');
const { getStatus, PLUGIN_STATUS } = require('./pluginsStatus');

async function installPlugins(plugins) {
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    // Try to install the plugin, if an error occurred, mark the plugin as disabled as well as its dependencies
    try {
      const installResult = await loadFile(path.join(plugin.dir.app, plugin.dir.install));
      // If the installation script exists
      if (installResult !== null) {
        plugin.status.isInstalled = true;
        await leemons.models.plugins.installed(plugin.name);
      }
    } catch (e) {
      // The installation failed, disable plugin
      plugin.status = {
        ...plugin.status,
        ...PLUGIN_STATUS.installationFailed,
      };
      // Disable dependant plugins
    }
  }
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
        },
      });

      // Save the plugin env
      pluginsEnv.set(plugin.path.app, env);

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

  // TODO:  Install plugins
  const nonInstalledPlugins = plugins.filter(
    (plugin) => !plugin.status.isInstalled && plugin.status.code === PLUGIN_STATUS.enabled.code
  );

  await installPlugins(nonInstalledPlugins);

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
}

module.exports = {
  loadExternalFiles,
};
