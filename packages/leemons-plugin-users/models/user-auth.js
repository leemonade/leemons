module.exports = {
  modelName: 'user-auth',
  collectionName: 'user-auth',
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
  },
  primaryKey: {
    type: 'uuid',
  },
};
