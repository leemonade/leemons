const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');

const { loadConfiguration } = require('../config/loadConfig');
const { loadFiles, loadFile } = require('../config/loadFiles');
const { formatModels } = require('../model/loadModel');
const { getLocalPlugins, getExternalPlugins } = require('./getPlugins');
const checkPluginDuplicates = require('./checkPluginDuplicates');
const loadServices = require('./loadServices');

function loadPlugins(leemons) {
  const plugins = [...getLocalPlugins(leemons), ...getExternalPlugins(leemons)];
  checkPluginDuplicates(plugins);

  let loadedPlugins = plugins.map((plugin) => {
    const config = loadConfiguration(plugin, plugin.path, {
      config: 'config',
      models: 'models',
      controllers: 'controllers',
      services: 'services',
    });

    return {
      source: plugin.source,
      name: config.get('config.name', plugin.name),
      dir: plugin.dir,
      config,
    };
  });

  checkPluginDuplicates(loadedPlugins);

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

  _.set(leemons, 'plugins', _.fromPairs(loadedPlugins));
}

module.exports = loadPlugins;
