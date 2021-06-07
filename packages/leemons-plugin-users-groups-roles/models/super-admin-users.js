module.exports = {
  modelName: 'super-admin-users',
  collectionName: 'super-admin-users',
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
