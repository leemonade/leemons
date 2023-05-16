module.exports = {
  modelName: 'super-admin-user',
  collectionName: 'super-admin-user',
  options: {
    useTimestamps: true,
  },
  attributes: {
    user: {
      references: {
        collection: 'plugins_users::users',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
