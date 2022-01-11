module.exports = {
  modelName: 'assets',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    description: {
      type: 'string',
    },
    cover: {
      type: 'string',
    },
    fromUser: {
      references: {
        collection: 'plugins_users::users',
      },
    },
    fromUserAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
    public: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
