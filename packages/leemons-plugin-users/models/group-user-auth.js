module.exports = {
  modelName: 'group-user-auth',
  collectionName: 'group-user-auth',
  options: {
    useTimestamps: true,
  },
  attributes: {
    group: {
      references: {
        collection: 'plugins_users::groups',
      },
    },
    userAuth: {
      references: {
        collection: 'plugins_users::user-auth',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
