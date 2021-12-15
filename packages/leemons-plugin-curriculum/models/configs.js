module.exports = {
  modelName: 'configs',
  collectionName: 'configs',
  options: {
    useTimestamps: true,
  },
  attributes: {
    key: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    value: {
      type: 'json',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
