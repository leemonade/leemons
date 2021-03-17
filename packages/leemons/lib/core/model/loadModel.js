const _ = require('lodash');
const path = require('path');

const { loadFiles } = require('../config/loadFiles');
const { createCoreStore, coreStoreProvider } = require('./coreStore');

function formatModel(name, modelConfig, leemons) {
  // TODO: standardize names
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
    target: 'global',
  };
  // Set default info for each model
  _.defaultsDeep(modelConfig, defaultModel);

  const schema = _.pick(modelConfig, ['collectionName', 'options', 'attributes', 'primaryKey']);
  const model = _.pick(modelConfig, ['connection', 'modelName', 'type', 'target']);
  _.set(model, 'schema', schema);
  if (model.connection === null) {
    throw new Error(`Connection in model ${model.modelName} can not be null`);
  }
  return { [model.modelName]: model };
}

function formatModels(models, leemons) {
  return Object.entries(models).reduce(
    (formattedModels, [name, model]) => ({
      ...formattedModels,
      ...formatModel(name, model, leemons),
    }),
    {}
  );
}

function loadModels(leemons) {
  const coreStore = createCoreStore();
  const global = loadFiles(path.resolve(leemons.dir.app, leemons.dir.model));

  _.set(
    leemons,
    'core_store',
    coreStoreProvider(formatModel('core_store', coreStore, leemons), leemons).core_store
  );
  _.set(leemons, 'global.models', formatModels(global, leemons));
}

module.exports = {
  loadModels,
  formatModels,
  formatModel,
};
