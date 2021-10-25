module.exports = {
  modelName: 'files',
  collectionName: 'files',
  options: {
    useTimestamps: true,
  },
  attributes: {
    provider: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    extension: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    url: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    fromUserAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
