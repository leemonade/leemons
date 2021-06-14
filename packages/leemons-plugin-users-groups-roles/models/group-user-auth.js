module.exports = {
  modelName: 'group-user-auth',
  collectionName: 'group-user-auth',
  options: {
    useTimestamps: true,
  },
  attributes: {
    group: {
      references: {
        collection: 'plugins_users-groups-roles::groups',
      },
    },
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
