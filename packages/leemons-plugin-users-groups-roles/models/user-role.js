module.exports = {
  modelName: 'user-role',
  collectionName: 'user-role',
  options: {
    useTimestamps: true,
  },
  attributes: {
    user: {
      references: {
        collection: 'plugins_users-groups-roles::users',
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
