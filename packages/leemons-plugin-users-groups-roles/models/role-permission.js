module.exports = {
  modelName: 'role-permission',
  collectionName: 'role-permission',
  options: {
    useTimestamps: true,
  },
  attributes: {
    role: {
      references: {
        collection: 'plugins_users-groups-roles::roles',
      },
    },
    permission: {
      references: {
        collection: 'plugins_users-groups-roles::permissions',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
