module.exports = {
  modelName: 'user-permission',
  collectionName: 'user-permission',
  options: {
    useTimestamps: true,
  },
  attributes: {
    user: {
      references: {
        collection: 'plugins_users-groups-roles::users',
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
