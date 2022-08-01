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
    encryptKey: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
