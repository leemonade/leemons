const _ = require('lodash');

function CoreStoreProvider(model) {
  const modelProvier = _.cloneDeep(model);

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

  return modelProvier;
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

  return CoreStoreProvider(model);
}

module.exports = createCoreStore;
