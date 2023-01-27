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
    muted: {
      type: 'boolean',
    },
    attached: {
      type: 'datetime',
    },
    encryptKey: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    isAdmin: {
      type: 'boolean',
    },
    adminMuted: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
