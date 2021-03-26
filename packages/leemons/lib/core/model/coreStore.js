// const _ = require('lodash');

// function coreStoreProvider(model, leemons) {
//   const modelProvider = _.cloneDeep(model.core_store);

//   Object.assign(modelProvider, {
//     get: (key, require = true, transacting) =>
//       leemons.core_store.model
//         .where({ key })
//         .fetch({
//           require,
//           transacting,
//         })
//         .then((result) => (result ? result.toJSON() : null)),

//     has: (key) =>
//       leemons.core_store.model
//         .where({ key })
//         .count()
//         .then((count) => count > 0),

//     set: ({ key, value, type, env, transacting }) =>
//       leemons.core_store.get(key, false, transacting).then((r) => {
//         const params = { key, value, type, env };
//         if (r) {
//           params.id = r.id;
//         }

//         return leemons.core_store.model.forge(params).save(null, { transacting });
//       }),
//   });

//   return { core_store: modelProvider };
// }

// function createCoreStore() {
//   const model = {
//     collectionName: 'core_store',
//     attributes: {
//       key: {
//         type: 'string',
//       },
//       value: {
//         specificType: 'text',
//       },
//       type: {
//         type: 'string',
//       },
//       env: {
//         type: 'string',
//       },
//     },
//     target: 'core_store',
//   };

//   return model;
// }

// module.exports = { createCoreStore, coreStoreProvider };

const _ = require('lodash');

function coreStoreProvider(model, leemons) {
  const modelProvider = _.cloneDeep(model.core_store);

  Object.assign(modelProvider, {
    get: (key, transacting) => leemons.query('core_store').findOne({ key }, { transacting }),

    has: (key, transacting) => leemons.query('core_store').count({ key }, { transacting }) > 0,

    set: ({ key, value, type, env, transacting }) =>
      leemons.query('core_store').set({ key }, { value, type, env }, { transacting }),
  });

  return { core_store: modelProvider };
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

module.exports = {
  createCoreStore,
  coreStoreProvider,
};
