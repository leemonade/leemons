const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');

const { getStackTrace } = require('leemons-utils');
const { loadConfiguration } = require('../config/loadConfig');
const { loadFiles, loadFile } = require('../config/loadFiles');
const { formatModels } = require('../model/loadModel');
const { getLocalPlugins, getExternalPlugins } = require('./getPlugins');
const checkPluginDuplicates = require('./checkPluginDuplicates');
const loadServices = require('./loadServices');
const loadFront = require('./front/loadFront');

function loadPlugins(leemons) {
  const plugins = [...getLocalPlugins(leemons), ...getExternalPlugins(leemons)];
  checkPluginDuplicates(plugins);

  // Load all the plugins configuration
  let loadedPlugins = plugins.map((plugin) => {
    const config = loadConfiguration(plugin, plugin.path, {
      config: 'config',
      models: 'models',
      controllers: 'controllers',
      services: 'services',
      next: 'next',
    });

    return {
      source: plugin.source,
      name: config.get('config.name', plugin.name),
      dir: plugin.dir,
      config,
    };
  });

  // Save the plugins in leemons (for the protect() to work)
  _.set(leemons, 'plugins', loadedPlugins);

  // Throw an error when two plugins have the same id
  checkPluginDuplicates(loadedPlugins);

  // Process every plugin
  loadedPlugins = loadedPlugins.map((plugin) => {
    const pluginObj = plugin;

    // Generate database models
    const pluginModels = loadFiles(path.resolve(pluginObj.dir.app, pluginObj.dir.models));
    pluginObj.models = formatModels(pluginModels, `plugins.${pluginObj.name}`);

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
    });

    // Load services
    const services = loadServices(path.resolve(pluginObj.dir.app, pluginObj.dir.services));

    // Return as the result of Object.entries
    return [pluginObj.name, { ...pluginObj, routes, controllers, services }];
  });

  // Load the frontend of all the plugins
  _.set(leemons, 'needsBuild', false);
  loadFront();

  // Split the plugins in private and public
  const privatePlugins = loadedPlugins.filter(
    ([, plugin]) => plugin.config.get('config.private', false) === true
  );
  loadedPlugins = loadedPlugins.filter(
    ([, plugin]) => plugin.config.get('config.private', false) === false
  );

  // Expose the plugin object under leemons.plugin
  Object.defineProperty(leemons, 'plugin', {
    get: () => {
      const caller = getStackTrace(2).fileName;
      const plugin = loadedPlugins.find(([, object]) => caller.startsWith(object.dir.app));
      if (plugin) {
        return plugin[1];
      }
      return null;
    },
  });
  const leemonsPath = `${path.dirname(require.resolve('leemons/package.json'))}/`;
  const leemonsDatabasePath = `${path.dirname(require.resolve('leemons-database/package.json'))}/`;

  Object.defineProperty(leemons, 'plugins', {
    get: () => {
      const caller = getStackTrace(2).fileName;

      const visiblePlugins = [...loadedPlugins];
      // Return the plugins
      const plugin = privatePlugins.find(([, object]) => {
        const allowedPaths = [object.dir.app, leemonsPath, leemonsDatabasePath];
        return allowedPaths.find((allowedPath) => caller.startsWith(allowedPath));
      });
      if (plugin) {
        visiblePlugins.push(plugin);
      }
      return _.fromPairs(visiblePlugins);
    },
  });
}

module.exports = loadPlugins;
