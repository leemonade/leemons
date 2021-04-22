const path = require('path');
const _ = require('lodash');
const fs = require('fs-extra');

// const { getStackTrace } = require('leemons-utils');
const { loadConfiguration } = require('../config/loadConfig');
const { loadFiles, loadFile } = require('../config/loadFiles');
const { formatModels } = require('../model/loadModel');
const { getLocalPlugins, getExternalPlugins } = require('./getPlugins');
const checkPluginDuplicates = require('./checkPluginDuplicates');
const loadServices = require('./loadServices');
const loadFront = require('./front/loadFront');

// Load plugins part 1 (load config and models)
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

  // Throw an error when two plugins have the same id (name)
  checkPluginDuplicates(loadedPlugins);

  // Process every plugin models
  loadedPlugins = loadedPlugins.map((plugin) => {
    const pluginObj = plugin;

    // Generate database models
    const pluginModels = loadFiles(path.resolve(pluginObj.dir.app, pluginObj.dir.models));
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
    });

    // Load services
    const services = loadServices(
      path.resolve(pluginObj.dir.app, pluginObj.dir.services),
      vmFilter
    );

    // Return as the result of Object.entries
    return [pluginObj.name, { ...pluginObj, routes, controllers, services }];
  });

  // Load the frontend of all the plugins
  _.set(leemons, 'frontNeedsBuild', false);
  _.set(leemons, 'frontNeedsUpdateDeps', false);
  loadFront(loadedPlugins);

  _.set(leemons, 'plugins', _.fromPairs(loadedPlugins));
  // Split the plugins in private and public
  // const privatePlugins = loadedPlugins
  //   .filter(([, plugin]) => plugin.config.get('config.private', false) === true)
  //   .map(([name, plugin]) => [name, { private: true, ...plugin }]);

  // loadedPlugins = loadedPlugins.filter(
  //   ([, plugin]) => plugin.config.get('config.private', false) === false
  // );

  // Expose the plugin object under leemons.plugin
  // Object.defineProperty(leemons, 'plugin', {
  //   get: () => {
  //     const caller = getStackTrace(4).fileName;
  //     // Get the plugin which is calling this property.
  //     const plugin = [...loadedPlugins, ...privatePlugins].find(([, object]) =>
  //       caller.startsWith(object.dir.app)
  //     );
  //     if (plugin) {
  //       return plugin[1];
  //     }
  //     return null;
  //   },
  // });
  // const leemonsPath = `${path.dirname(require.resolve('leemons/package.json'))}/`;
  // const leemonsDatabasePath = `${path.dirname(require.resolve('leemons-database/package.json'))}/`;

  // Expose all the plugins object under leemons.plugins (private plugins only shown to the allowed ones)
  // Object.defineProperty(leemons, 'plugins', {
  //   get: () => {
  //     let caller = getStackTrace(2).fileName;

  //     // When containerized in VM
  //     if (caller === null) {
  //       caller = getStackTrace(4).fileName;
  //     }
  //     const visiblePlugins = [...loadedPlugins];
  //     // Return the plugins
  //     const visiblePrivatePlugins = privatePlugins.filter(([, object]) => {
  //       const allowedPaths = [object.dir.app, leemonsPath, leemonsDatabasePath];
  //       return allowedPaths.find((allowedPath) => caller.startsWith(allowedPath));
  //     });
  //     if (visiblePrivatePlugins.length) {
  //       visiblePlugins.push(...visiblePrivatePlugins);
  //     }
  //     return _.fromPairs(visiblePlugins);
  //   },
  // });
}

module.exports = { loadPlugins, initializePlugins };
