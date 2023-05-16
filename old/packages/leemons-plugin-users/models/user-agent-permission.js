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
      type: 'text',
      options: {
        notNull: true,
        index: true,
        indexOptions: {
          indexType: 'FULLTEXT',
        },
      },
    },
    actionName: {
      type: 'string',
      options: {
        notNull: true,
        index: true,
      },
    },
    target: {
      type: 'string',
      options: {
        index: true,
      },
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
