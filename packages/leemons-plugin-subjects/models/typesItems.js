module.exports = {
  modelName: 'typesItems',
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
