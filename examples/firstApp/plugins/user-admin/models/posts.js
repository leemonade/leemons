module.exports = {
  modelName: 'posts',
  collectionName: 'posts',
  options: {
    hasTimestamps: true,
  },
  attributes: {
    title: {
      type: 'string',
      length: 64,
    },
    body: {
      specificType: 'text',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
