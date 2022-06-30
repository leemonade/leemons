module.exports = {
  modelName: 'dataset-values',
  collectionName: 'dataset-values',
  options: {
    useTimestamps: true,
  },
  attributes: {
    pluginName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    locationName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    target: {
      type: 'string',
    },
    key: {
      type: 'string',
    },
    value: {
      type: 'json',
    },
    searchableValueString: {
      type: 'richtext',
    },
    searchableValueNumber: {
      type: 'richtext',
    },
    metadata: {
      type: 'json',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
