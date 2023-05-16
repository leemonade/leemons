module.exports = {
  modelName: 'event-types',
  collectionName: 'event-types',
  options: {
    useTimestamps: true,
  },
  attributes: {
    key: {
      type: 'string',
      options: {
        unique: true,
        notNull: true,
      },
    },
    url: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    pluginName: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    onlyOneDate: {
      type: 'boolean',
    },
    order: {
      type: 'integer',
    },
    config: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
