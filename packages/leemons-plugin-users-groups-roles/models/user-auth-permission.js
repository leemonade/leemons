module.exports = {
  modelName: 'user-auth-permission',
  collectionName: 'user-auth-permission',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAuth: {
      references: {
        collection: 'plugins_users-groups-roles::user-auth',
      },
    },
    permission: {
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
        collection: 'plugins_users-groups-roles::roles',
      },
    },
  },
  primaryKey: {
    type: 'string',
  },
};
