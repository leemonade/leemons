module.exports = {
  modelName: 'user-agent-contacts',
  collectionName: 'user-agent-contacts',
  options: {
    useTimestamps: true,
  },
  attributes: {
    fromUserAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
    fromCenter: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
    fromProfile: {
      references: {
        collection: 'plugins_users::profiles',
      },
    },
    toUserAgent: {
      references: {
        collection: 'plugins_users::user-agent',
      },
    },
    toCenter: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
    toProfile: {
      references: {
        collection: 'plugins_users::profiles',
      },
    },
    pluginName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    target: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
