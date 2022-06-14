module.exports = {
  modelName: 'assign-saved-config',
  collectionName: 'assign-saved-config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
    config: {
      type: 'json',
    },
    userAgent: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_users::user-agent',
      },
      */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
