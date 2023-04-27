module.exports = {
  modelName: 'user-agent',
  collectionName: 'user-agent',
  options: {
    useTimestamps: true,
  },
  attributes: {
    user: {
      references: {
        collection: 'plugins_users::users',
      },
    },
    role: {
      references: {
        collection: 'plugins_users::roles',
      },
    },
    reloadPermissions: {
      type: 'boolean',
      options: {
        defaultTo: false,
      },
    },
    datasetIsGood: {
      type: 'boolean',
    },
    disabled: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
