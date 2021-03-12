const _ = require('lodash');
const path = require('path');

const { loadFiles } = require('../config/loadFiles');
const { createCoreStore, coreStoreProvider } = require('./coreStore');

function formatModel(name, modelConfig, leemons) {
  // TODO: standarize names
  const defaultModel = {
    modelName: name,
    connection: leemons.config.get('database.defaultConnection'),
    collectionName: name,
    info: {
      name,
      description: '',
    },
    options: {},
    attributes: {},
    primaryKey: {
      name: 'id',
      type: 'int',
    },
    type: 'collection',
  };
  // Set default info for each model
  _.defaultsDeep(modelConfig, defaultModel);

  const schema = _.pick(modelConfig, ['collectionName', 'options', 'attributes', 'primaryKey']);
  const model = _.pick(modelConfig, ['connection', 'modelName', 'type']);
  _.set(model, 'schema', schema);
  _.set(model, 'target', 'global');

  return { [model.modelName]: model };
}

function formatModels(models, leemons) {
  return Object.entries(models).reduce(
    (formatedModels, [name, model]) => ({
      ...formatedModels,
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
    coreStoreProvider(formatModel('core_store', coreStore, leemons)).core_store
  );
  _.set(leemons, 'global.models', formatModels(global, leemons));
}

module.exports = {
  loadModels,
  formatModels,
};
