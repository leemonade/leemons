module.exports = {
  modelName: 'settings',
  collectionName: 'settings',
  options: {
    useTimestamps: true,
  },
  attributes: {
    hideWelcome: {
      type: 'boolean',
    },
    configured: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
