module.exports = {
  modelName: 'active-provider',
  collectionName: 'active-provider',
  options: {
    useTimestamps: true,
  },
  attributes: {
    providerName: {
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
