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
      type: 'string',
    },
  },
  primaryKey: {
    type: 'string',
  },
};
