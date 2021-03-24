const path = require('path');
const _ = require('lodash');

const { loadConfiguration } = require('../config/loadConfig');
const { loadFiles } = require('../config/loadFiles');
const { formatModels } = require('../model/loadModel');
const { getLocalPlugins, getExternalPlugins } = require('./getPlugins');

function loadPlugins(leemons) {
  const plugins = [...getLocalPlugins(leemons), ...getExternalPlugins(leemons)];

  const loadedPlugins = plugins.map((plugin) => {
    const config = loadConfiguration(plugin, plugin.path, {
      config: 'config',
      model: 'models',
      plugins: 'plugins',
    });

    const pluginObj = {
      source: plugin.source,
      name: config.get('config.name', plugin.name),
      dir: plugin.dir,
      config,
    };

    // Generate database models
    const pluginModels = loadFiles(path.resolve(pluginObj.dir.app, pluginObj.dir.model));
    pluginObj.models = formatModels(pluginModels, `plugins.${pluginObj.name}`);

    // Return as the result of Object.entries
    return [pluginObj.name, pluginObj];
  });

  _.set(leemons, 'plugins', _.fromPairs(loadedPlugins));
}

module.exports = loadPlugins;
