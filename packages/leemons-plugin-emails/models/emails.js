module.exports = {
  modelName: 'emails',
  collectionName: 'emails',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    templateName: {
      type: 'string',
      options: {
        unique: true,
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
