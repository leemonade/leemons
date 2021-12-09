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
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
