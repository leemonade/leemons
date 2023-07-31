const { generateModelName } = require('leemons-utils');
const _ = require('lodash');

const { createCoreStore, createCoreStoreProvider } = require('./coreStore');
const { createPlugins, createPluginsProvider } = require('./plugins');

function formatModel(name, modelConfig, target = 'global') {
  const defaultModel = {
    modelName: name,
    connection: leemons ? leemons.config.get('database.defaultConnection') : null,
    collectionName: name,
    info: {
      name,
      description: '',
    },
    options: {
      useTimestamps: false,
      omit: {
        deleted: true,
      },
    },
    attributes: {},
    primaryKey: {
      name: 'id',
      type: 'int',
    },
    type: 'collection',
    target,
  };
  // Set default info for each model
  _.defaultsDeep(modelConfig, defaultModel);

  const schema = _.pick(modelConfig, ['collectionName', 'options', 'attributes', 'primaryKey']);
  const model = _.pick(modelConfig, ['connection', 'modelName', 'type', 'target']);

  // standardize modelName
  model.originalModelName = model.modelName;
  model.modelName = generateModelName(model.target, model.modelName);
  // standardize collectionName
  schema.collectionName = generateModelName(model.target, schema.collectionName);

  _.set(model, 'schema', schema);

  const attributesArray = Object.entries(model.schema.attributes);
  // Get the collection attributes (not relations)
  _.set(model.schema, 'allAttributes', [
    ...attributesArray
      .filter(
        ([, value]) => !_.has(value, 'references') || value.references.relation !== 'many to many'
      )
      .map(([attributeName]) => attributeName),
    model.schema.primaryKey.name,
    ...['created_at', 'updated_at'].filter(() => model.schema.options.useTimestamps),
  ]);
  if (model.connection === null) {
    throw new Error(`Connection in model ${model.modelName} can not be null`);
  }
  return { [model.modelName]: model };
}

function formatModels(models, target = 'global') {
  return Object.entries(models).reduce(
    (formattedModels, [name, model]) => ({
      ...formattedModels,
      ...formatModel(name, model, target),
    }),
    {}
  );
}

function loadCoreModels(leemons) {
  const coreStore = createCoreStore();
  const plugins = createPlugins('plugins');
  const providers = createPlugins('providers');

  const coreStoreProvider = createCoreStoreProvider(
    formatModel(coreStore.collectionName, coreStore, coreStore.target),
    leemons
  );
  const pluginsProvider = createPluginsProvider(
    formatModel(plugins.collectionName, plugins, plugins.target),
    'plugins',
    leemons
  );
  const providersProvider = createPluginsProvider(
    formatModel(providers.collectionName, providers, providers.target),
    'providers',
    leemons
  );

  _.set(leemons, 'models', {
    core_store: coreStoreProvider,
    plugins: pluginsProvider,
    providers: providersProvider,
  });
}

module.exports = {
  loadCoreModels,
  formatModels,
  formatModel,
};
