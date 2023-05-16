module.exports = {
  modelName: 'settings',
  collectionName: 'settings',
  options: {
    useTimestamps: true,
  },
  attributes: {
    configured: {
      type: 'boolean',
    },
    status: {
      type: 'string',
      options: {
        defaultTo: 'NONE',
      },
    },
    lang: {
      type: 'string',
      options: {
        defaultTo: 'en',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
