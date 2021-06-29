module.exports = {
  modelName: 'menu',
  collectionName: 'menu',
  options: {
    useTimestamps: true,
  },
  attributes: {
    slug: {
      type: 'string',
      options: {
        unique: true,
        notNull: true,
      },
    },
    name: {
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
