module.exports = {
  modelName: 'config',
  collectionName: 'config',
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
    region: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    accessKey: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    secretAccessKey: {
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
