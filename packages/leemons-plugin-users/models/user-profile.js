module.exports = {
  modelName: 'user-profile',
  collectionName: 'user-profile',
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
    role: {
      references: {
        collection: 'plugins_users::roles',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
