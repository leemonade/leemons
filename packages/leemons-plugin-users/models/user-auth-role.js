module.exports = {
  modelName: 'user-auth-role',
  collectionName: 'user-auth-role',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAuth: {
      references: {
        collection: 'plugins_users::user-auth',
      },
    },
    role: {
      references: {
        collection: 'plugins_users::roles',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
