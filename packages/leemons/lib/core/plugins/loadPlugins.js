const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');

// const { getStackTrace } = require('leemons-utils');
const { generateEnv } = require('leemons-utils/lib/env');
const { loadConfiguration } = require('../config/loadConfig');
const { loadFiles, loadFile } = require('../config/loadFiles');
const { formatModels } = require('../model/loadModel');
const { getLocalPlugins, getExternalPlugins } = require('./getPlugins');
const checkPluginDuplicates = require('./checkPluginDuplicates');
const loadServices = require('./loadServices');
const loadFront = require('./front/loadFront');

let pluginsEnv;

// Load plugins part 1 (load config and models)
async function loadPlugins(leemons) {
  const plugins = [...getLocalPlugins(leemons), ...getExternalPlugins(leemons)];
  checkPluginDuplicates(plugins);

  // Load all the plugins configuration
  let loadedPlugins = await Promise.all(
    plugins.map(async (plugin) => {
      const config = await loadConfiguration(plugin, {
        dir: plugin.path,
        defaultDirs: {
          config: 'config',
          models: 'models',
          controllers: 'controllers',
          services: 'services',
          next: 'next',
          env: '.env',
        },
      });

      return {
        source: plugin.source,
        name: config.get('config.name', plugin.name),
        dir: plugin.dir,
        config,
      };
    })
  );

  pluginsEnv = await Promise.all(
    loadedPlugins
      .map((plugin) => [
        plugin.name,
        path.isAbsolute(plugin.dir.env)
          ? plugin.dir.env
          : path.resolve(plugin.dir.app, plugin.dir.env),
      ])
      .map(async ([name, file]) => [name, await generateEnv(file)])
  ).then(_.fromPairs);

  // Throw an error when two plugins have the same id (name)
  checkPluginDuplicates(loadedPlugins);

  // Process every plugin models
  loadedPlugins = loadedPlugins.map((plugin) => {
    const pluginObj = plugin;

    // Generate database models
    const pluginModels = loadFiles(path.resolve(pluginObj.dir.app, pluginObj.dir.models), {
      env: pluginsEnv[pluginObj.name],
    });
    pluginObj.models = formatModels(pluginModels, `plugins.${pluginObj.name}`);

    return [pluginObj.name, pluginObj];
  });

  // Save the plugins in leemons (for the connector to detect them)
  _.set(leemons, 'plugins', _.fromPairs(loadedPlugins));
}

// Load plugins part 2 (controllers, services and front)
function initializePlugins(leemons) {
  let loadedPlugins = _.values(leemons.plugins);
  // Process every plugin
  loadedPlugins = loadedPlugins.map((plugin) => {
    const pluginObj = plugin;

    // VM filter
    const allowedPlugins = loadedPlugins
      .filter((loadedPlugin) => loadedPlugin.config.get('config.private', false) === false)
      .map((publicPlugin) => publicPlugin.name);
    if (!allowedPlugins.includes(plugin.name)) {
      allowedPlugins.push(plugin.name);
    }

    const vmFilter = (filtered) => {
      Object.defineProperty(filtered.leemons, 'plugin', {
        // The binding is needed for triggering the outside VM leemons
        // eslint-disable-next-line no-extra-bind
        get: () => leemons.plugins[plugin.name],
      });
      Object.defineProperty(filtered.leemons, 'plugins', {
        get: () => _.pick(leemons.plugins, allowedPlugins),
      });
      const { query } = filtered.leemons;
      _.set(filtered, 'leemons.query', (modelName) => query(modelName, plugin.name));
      return filtered;
    };

    // Load routes
    let routesFile = path.resolve(pluginObj.dir.app, pluginObj.dir.controllers, 'routes');
    let routes = {};
    if (fs.existsSync(`${routesFile}.json`)) {
      routesFile += '.json';
      routes = loadFile(routesFile);
    } else if (fs.existsSync(`${routesFile}.js`)) {
      routesFile += '.js';
      routes = loadFile(routesFile);
    }

    // Load controllers
    const controllers = loadFiles(path.resolve(pluginObj.dir.app, pluginObj.dir.controllers), {
      accept: ['.js'],
      exclude: [path.basename(routesFile)],
      filter: vmFilter,
      env: pluginsEnv[pluginObj.name],
    });

    // Load services
    const services = loadServices(
      path.resolve(pluginObj.dir.app, pluginObj.dir.services),
      vmFilter,
      pluginsEnv[pluginObj.name]
    );

    // Return as the result of Object.entries
    return [pluginObj.name, { ...pluginObj, routes, controllers, services }];
  });

  // Load the frontend of all the plugins
  _.set(leemons, 'frontNeedsBuild', false);
  _.set(leemons, 'frontNeedsUpdateDeps', false);
  loadFront(loadedPlugins);

  _.set(leemons, 'plugins', _.fromPairs(loadedPlugins));
}

module.exports = { loadPlugins, initializePlugins };
