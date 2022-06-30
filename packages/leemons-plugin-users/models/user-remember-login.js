module.exports = {
  modelName: 'user-remember-login',
  collectionName: 'user-remember-login',
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
    center: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
