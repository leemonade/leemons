module.exports = {
  modelName: 'widget-zone',
  collectionName: 'widget-zone',
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
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
