module.exports = {
  modelName: 'roomMessagesUnRead',
  collectionName: 'roomMessagesUnRead',
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
      type: 'string',
      options: {
        notNull: true,
      },
      /*
      references: {
        collection: 'plugins_comunica::message',
      }
      */
    },
    count: {
      type: 'integer',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
