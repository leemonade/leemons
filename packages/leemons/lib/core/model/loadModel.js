const _ = require('lodash');
const path = require('path');
const { loadFiles } = require('../config/loadFiles');
const createCoreStore = require('./coreStore');

function formatModel(name, model, leemons) {
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
  _.defaultsDeep(model, defaultModel);
}

function formatModels(models, leemons) {
  _.forOwn(models, (model, name) => formatModel(name, model, leemons));
}

function loadModels(leemons) {
  const coreStore = createCoreStore();
  const global = loadFiles(path.resolve(leemons.dir.app, leemons.dir.model));

  formatModel('core_store', coreStore, leemons);
  formatModels(global, leemons);

  return {
    core_store: coreStore,
    ...global,
  };
}

module.exports = {
  loadModels,
  formatModels,
};
