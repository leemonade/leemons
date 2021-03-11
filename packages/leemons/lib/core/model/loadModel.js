const _ = require('lodash');
const { loadFiles } = require('../config/loadFiles');

function loadModels(dir) {
  return loadFiles(dir);
}

function formatModels(leemons) {
  const { models } = leemons;

  Object.entries(models).forEach(([name, model]) => {
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
    };
    // Set default info for each model
    _.defaultsDeep(model, defaultModel);
  });
}

module.exports = {
  loadModels,
  formatModels,
};
