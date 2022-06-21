module.exports = {
  modelName: 'program-configs',
  collectionName: 'program-configs',
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
