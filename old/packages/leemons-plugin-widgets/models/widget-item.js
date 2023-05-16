module.exports = {
  modelName: 'widget-item',
  collectionName: 'widget-item',
  options: {
    useTimestamps: true,
  },
  attributes: {
    zoneKey: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
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
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    order: {
      type: 'number',
    },
    properties: {
      type: 'text',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
