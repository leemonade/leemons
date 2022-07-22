module.exports = {
  modelName: 'userAgentInRoom',
  collectionName: 'userAgentInRoom',
  options: {
    useTimestamps: true,
  },
  attributes: {
    room: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    userAgent: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
      /*
      references: {
        collection: 'plugins_users::user-agent',
      }
      */
    },
    message: {
      type: 'json',
    },
    isEncrypt: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
