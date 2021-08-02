module.exports = {
  modelName: 'user-remember-profile',
  collectionName: 'user-remember-profile',
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
  },
  primaryKey: {
    type: 'uuid',
  },
};
