module.exports = {
  modelName: 'userAgentConfig',
  collectionName: 'userAgentConfig',
  options: {
    useTimestamps: true,
  },
  attributes: {
    userAgent: {
      type: 'string',
      options: {
        notNull: true,
      },
      /*
      references: {
        collection: 'plugins_users::user-agent',
      }
      */
    },
    muted: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
