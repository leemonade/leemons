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
    type: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
