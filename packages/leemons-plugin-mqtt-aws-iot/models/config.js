module.exports = {
  modelName: 'config',
  collectionName: 'config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    region: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    accessKeyId: {
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
