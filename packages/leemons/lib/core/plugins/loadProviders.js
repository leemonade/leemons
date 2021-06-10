const _ = require('lodash');
const path = require('path');

const { loadConfiguration } = require('../config/loadConfig');
const { getLocalProviders, getExternalProviders } = require('./getProviders');
const checkPluginDuplicates = require('./checkPluginDuplicates');
const loadServices = require('./loadServices');
const { formatModels } = require('../model/loadModel');
const { loadFiles } = require('../config/loadFiles');

let providersEnv = [];

// Load plugins part 1 (load config and models)
async function loadProvidersConfig(leemons) {
  const providers = [
    ...(await getLocalProviders(leemons)),
    ...(await getExternalProviders(leemons)),
  ];

  // Load all the plugins configuration
  const loadedProviders = await Promise.all(
    providers.map(async (plugin) => {
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
        },
      });

      // Save the plugin env
      providersEnv.push([config.get('config.name', plugin.name), env]);

      return {
        source: plugin.source,
        name: config.get('config.name', plugin.name),
        dir: plugin.dir,
        config,
      };
    })
  );

  // Convert the plugins env to a json ([[name, value]] => {name: value})
  providersEnv = _.fromPairs(providersEnv);

  // Throw an error when two plugins have the same id (name)
  checkPluginDuplicates(loadedProviders);

  return loadedProviders;
}

async function loadProvidersModels(providerObjs, leemons) {
  let loadedProvider = providerObjs;

  // Process every plugin models
  loadedProvider = await Promise.all(
    loadedProvider.map(async (provider) => {
      const providerObj = provider;

      // Generate database models
      const pluginModels = await loadFiles(
        path.resolve(providerObj.dir.app, providerObj.dir.models),
        {
          env: providersEnv[providerObj.name],
        }
      );
      providerObj.models = formatModels(pluginModels, `providers.${providerObj.name}`);

      return [providerObj.name, providerObj];
    })
  );

  // Save the plugins in leemons (for the connector to detect them)
  _.set(leemons, 'providers', _.fromPairs(loadedProvider));
}

// Load plugins part 2 (controllers, services and front)
async function initializeProviders(leemons) {
  let loadedProviders = _.values(leemons.providers);

  // Process every plugin
  loadedProviders = await Promise.all(
    loadedProviders.map(async (provider) => {
      const pluginObj = provider;

      // VM filter
      // TODO: Refactor (Maybe some code can be run only once?) [Check after implementing plugin Deps]
      const allowedProviders = loadedProviders
        .filter((loadedPlugin) => loadedPlugin.config.get('config.private', false) === false)
        .map((publicPlugin) => publicPlugin.name);
      if (!allowedProviders.includes(provider.name)) {
        allowedProviders.push(provider.name);
      }

      const vmFilter = (filtered) => {
        Object.defineProperty(filtered.leemons, 'provider', {
          // TODO: Check binding missing
          // The binding is needed for triggering the outside VM leemons
          // eslint-disable-next-line no-extra-bind
          get: () => leemons.providers[provider.name],
        });
        Object.defineProperty(filtered.leemons, 'providers', {
          get: () => _.pick(leemons.providers, allowedProviders),
        });
        const { query } = filtered.leemons;
        _.set(filtered, 'leemons.query', (modelName) => query(modelName, provider.name));
        return filtered;
      };

      // Load services
      const services = await loadServices(
        // path.resolve(pluginObj.dir.app, pluginObj.dir.services),
        pluginObj,
        vmFilter,
        providersEnv[pluginObj.name]
      );

      // Return as the result of Object.entries
      return [pluginObj.name, { ...pluginObj, services }];
    })
  );
  _.set(leemons, 'providers', _.fromPairs(loadedProviders));
}

module.exports = { loadProvidersConfig, initializeProviders, loadProvidersModels };
