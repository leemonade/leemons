module.exports = {
  modelName: 'group-user',
  collectionName: 'group-user',
  options: {
    useTimestamps: true,
  },
  attributes: {
    group: {
      references: {
        collection: 'plugins_users-groups-roles::groups',
      },
    },
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
