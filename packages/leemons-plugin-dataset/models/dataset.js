module.exports = {
  modelName: 'dataset',
  collectionName: 'dataset',
  options: {
    useTimestamps: true,
  },
  attributes: {
    pluginName: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    locationName: {
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
