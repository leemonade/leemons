const _ = require('lodash');

function createCoreStoreProvider(model, leemons) {
  const modelProvider = _.cloneDeep(model['models::core_store']);

  // Return the core_store model with helper functions
  Object.assign(modelProvider, {
    get: (key, transacting) =>
      leemons.query('models::core_store').findOne({ key }, { transacting }),

    has: (key, transacting) =>
      leemons.query('models::core_store').count({ key }, { transacting }) > 0,

    set: ({ key, value, type, env, transacting }) =>
      leemons.query('models::core_store').set({ key }, { value, type, env }, { transacting }),
  });

  return modelProvider;
}

function createCoreStore() {
  // Generate a model with a table called 'core_store' and the attrbutes: key, value, type, and env
  const model = {
    collectionName: 'core_store',
    attributes: {
      key: {
        type: 'string',
      },
      value: {
        specificType: 'text',
      },
      type: {
        type: 'string',
      },
      env: {
        type: 'string',
      },
    },
    target: 'models',
  };

  return model;
}

module.exports = {
  createCoreStore,
  createCoreStoreProvider,
};
