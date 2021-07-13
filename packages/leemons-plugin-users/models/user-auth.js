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
    profile: {
      references: {
        collection: 'plugins_users::profiles',
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
