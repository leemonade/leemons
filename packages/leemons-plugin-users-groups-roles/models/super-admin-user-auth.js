module.exports = {
  modelName: 'super-admin-user-auth',
  collectionName: 'super-admin-user-auth',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAuth: {
      references: {
        collection: 'plugins_users-groups-roles::user-auth',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
