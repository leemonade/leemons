const _ = require('lodash');

function createPluginsProvider(model, target, leemons) {
  const modelName = `models::${target}`;
  const modelProvider = _.cloneDeep(model[modelName]);

  // Return the core_store model with helper functions
  Object.assign(modelProvider, {
    add: ({ name, path, version, source }, transacting) =>
      leemons.query(modelName).create({ name, path, version, source }, { transacting }),
    get: (name, transacting) => leemons.query(modelName).findOne({ name }, { transacting }),

    setVersion: (name, version) => leemons.query(modelName).set({ name }, { version }),

    has: (name, transacting) => leemons.query(modelName).count({ name }, { transacting }) > 0,

    getAll: (transacting) =>
      leemons.query(modelName).find({ id_$null: false, isUninstalled: false }, { transacting }),

    installed: (name, status = true) =>
      leemons.query(modelName).set({ name }, { isInstalled: status }),

    disabled: (name, status = true) =>
      leemons.query(modelName).set({ name }, { isDisabled: status }),

    setUp: (name, status = true) => leemons.query(modelName).set({ name }, { isSetUp: status }),

    needsSetUp: (name, status = true) =>
      leemons.query(modelName).set({ name }, { needsSetUp: status }),

    uninstalled: (name, status = true) =>
      leemons.query(modelName).set({ name }, { isUninstalled: status }),

    broken: (name, status = true) => leemons.query(modelName).set({ name }, { isBroken: status }),

    updatable: (name, status = true) =>
      leemons.query(modelName).set({ name }, { hasUpdate: status }),
  });

  return modelProvider;
}

function createPlugins(collectionName) {
  const model = {
    collectionName,
    attributes: {
      name: {
        type: 'string',
        options: {
          notNull: true,
          unique: true,
        },
      },
      path: {
        type: 'text',
        options: {
          notNull: true,
        },
      },
      version: {
        type: 'string',
        length: 11, // max version: 999.999.999
        options: {
          notNull: true,
        },
      },
      source: {
        type: 'string',
        length: 8, // local | external
        options: {
          notNull: true,
        },
      },
      isInstalled: {
        type: 'boolean',
        options: {
          defaultTo: false,
          notNull: true,
        },
      },
      isDisabled: {
        type: 'boolean',
        options: {
          defaultTo: false,
          notNull: true,
        },
      },
      isSetUp: {
        type: 'boolean',
        options: {
          defaultTo: false,
          notNull: true,
        },
      },
      needsSetUp: {
        type: 'boolean',
        options: {
          defaultTo: false,
          notNull: true,
        },
      },
      isUninstalled: {
        type: 'boolean',
        options: {
          defaultTo: false,
          notNull: true,
        },
      },
      isBroken: {
        type: 'boolean',
        options: {
          defaultTo: false,
          notNull: true,
        },
      },
      hasUpdate: {
        type: 'boolean',
        options: {
          defaultTo: false,
          notNull: true,
        },
      },
    },
    target: 'models',
  };

  return model;
}

module.exports = {
  createPlugins,
  createPluginsProvider,
};
