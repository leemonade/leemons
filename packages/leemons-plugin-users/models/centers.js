module.exports = {
  modelName: 'centers',
  collectionName: 'centers',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    description: {
      type: 'string',
    },
    locale: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    uri: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
