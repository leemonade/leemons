module.exports = {
  modelName: 'user-auth',
  collectionName: 'user-auth',
  options: {
    useTimestamps: true,
  },
  attributes: {
    user: {
      references: {
        collection: 'plugins_users-groups-roles::users',
      },
    },
    profile: {
      references: {
        collection: 'plugins_users-groups-roles::profiles',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
