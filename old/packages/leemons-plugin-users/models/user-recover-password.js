module.exports = {
  modelName: 'user-recover-password',
  collectionName: 'user-recover-password',
  options: {
    useTimestamps: true,
  },
  attributes: {
    user: {
      references: {
        collection: 'plugins_users::users',
      },
    },
    code: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
