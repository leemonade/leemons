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
  },
  primaryKey: {
    type: 'uuid',
  },
};
