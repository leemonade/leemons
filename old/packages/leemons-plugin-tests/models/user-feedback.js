module.exports = {
  modelName: 'user-feedback',
  collectionName: 'user-feedback',
  options: {
    useTimestamps: true,
  },
  attributes: {
    instance: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_assignables::assignableInstances',
      },
      */
    },
    toUserAgent: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_users::user-agent',
      },
      */
    },
    fromUserAgent: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_users::user-agent',
      },
      */
    },
    feedback: {
      type: 'text',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
