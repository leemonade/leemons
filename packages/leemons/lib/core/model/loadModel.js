const { generateModelName } = require('leemons-utils');
const _ = require('lodash');

const { createCoreStore, coreStoreProvider } = require('./coreStore');

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

  // Ignore in core_store
  if (model.target !== 'core_store') {
    // standardize modelName
    model.originalModelName = model.modelName;
    model.modelName = generateModelName(model.target, model.modelName);
    // standardize collectionName
    schema.collectionName = generateModelName(model.target, schema.collectionName);
  }

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

function loadModels(leemons) {
  const coreStore = createCoreStore();

  _.set(
    leemons,
    'core_store',
    coreStoreProvider(formatModel('core_store', coreStore, 'core_store', leemons), leemons)
      .core_store
  );
}

module.exports = {
  loadModels,
  formatModels,
  formatModel,
};
