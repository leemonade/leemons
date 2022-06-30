module.exports = {
  modelName: 'tags',
  collectionName: 'tags',
  options: {
    useTimestamps: true,
  },
  attributes: {
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    tag: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    value: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
