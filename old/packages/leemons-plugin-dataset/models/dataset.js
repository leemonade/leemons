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
      },
    },
    locationName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    jsonSchema: {
      type: 'text',
      textType: 'mediumText',
    },
    jsonUI: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
