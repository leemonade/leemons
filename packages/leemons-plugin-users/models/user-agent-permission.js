module.exports = {
  modelName: 'user-agent-permission',
  collectionName: 'user-agent-permission',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAgent: {
      references: {
        collection: 'plugins_users::user-agent',
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
