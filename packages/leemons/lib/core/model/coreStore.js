const _ = require('lodash');

function coreStoreProvider(model, leemons) {
  const modelProvier = _.cloneDeep(model.core_store);

  Object.assign(modelProvier, {
    get: (key, require = true) =>
      leemons.core_store.model
        .where({ key })
        .fetch({
          require,
        })
        .then((result) => (result ? result.toJSON() : null)),

    has: (key) =>
      leemons.core_store.model
        .where({ key })
        .count()
        .then((count) => count > 0),

    set: (key, value, type, env) =>
      leemons.core_store.get(key, false).then((r) => {
        const params = { key, value, type, env };
        if (r) {
          params.id = r.id;
        }

        return leemons.core_store.model.forge(params).save();
      }),
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
        specificType: 'text',
      },
      type: {
        type: 'string',
      },
      env: {
        type: 'string',
      },
    },
    target: 'core_store',
  };

  return model;
}

module.exports = { createCoreStore, coreStoreProvider };
