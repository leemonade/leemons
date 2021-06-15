module.exports = {
  modelName: 'groups',
  collectionName: 'groups',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
