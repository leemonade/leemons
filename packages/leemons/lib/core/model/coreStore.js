const _ = require('lodash');

function coreStoreProvider(model) {
  const modelProvier = _.cloneDeep(model.core_store);

  Object.assign(modelProvier, {
    get: () => {
      // TODO: get a specific value from core_store
    },
    has: () => {
      // TODO: get if a specific key exists in core_store
    },
    set: () => {
      // TODO: set a new value in the core_store
    },
  });

  return { core_store: modelProvier };
}

function createCoreStore() {
  const model = {
    collectionName: 'core_store',
    attributes: {
      key: {
        type: 'string',
      },
      value: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      env: {
        type: 'string',
      },
    },
  };

  return model;
}

module.exports = { createCoreStore, coreStoreProvider };
