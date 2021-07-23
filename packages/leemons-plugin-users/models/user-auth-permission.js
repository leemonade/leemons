module.exports = {
  modelName: 'user-auth-permission',
  collectionName: 'user-auth-permission',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAuth: {
      references: {
        collection: 'plugins_users::user-auth',
      },
    },
    permissionName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    actionName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    target: {
      type: 'string',
    },
    role: {
      references: {
        collection: 'plugins_users::roles',
      },
    },
    center: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
