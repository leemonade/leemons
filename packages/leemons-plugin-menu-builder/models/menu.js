module.exports = {
  modelName: 'menu',
  collectionName: 'menu',
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
  },
  primaryKey: {
    type: 'uuid',
  },
};
