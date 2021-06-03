module.exports = {
  modelName: 'group-role',
  collectionName: 'group-role',
  options: {
    useTimestamps: true,
  },
  attributes: {
    group: {
      references: {
        collection: 'plugins_users-groups-roles::groups',
      },
    },
    role: {
      references: {
        collection: 'plugins_users-groups-roles::roles',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
