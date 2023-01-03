module.exports = {
  modelName: 'message',
  collectionName: 'message',
  options: {
    useTimestamps: true,
  },
  attributes: {
    room: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
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
    message: {
      type: 'text',
      textType: 'mediumText',
    },
    isEncrypt: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
