module.exports = {
  modelName: 'teachingItems',
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
