module.exports = {
  modelName: 'theme',
  collectionName: 'theme',
  connection: 'mongo',
  options: {
    useTimestamps: true,
  },
  attributes: {
    tokens: {
      type: 'mixed',
    },
  },
};
