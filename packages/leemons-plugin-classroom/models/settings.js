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
  },
  primaryKey: {
    type: 'uuid',
  },
};
