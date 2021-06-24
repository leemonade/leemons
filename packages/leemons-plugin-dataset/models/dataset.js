module.exports = {
  modelName: 'dataset',
  collectionName: 'dataset',
  options: {
    useTimestamps: true,
  },
  attributes: {
    plugin: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    language: {
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
