module.exports = {
  modelName: 'know-how-to-use',
  collectionName: 'know-how-to-use',
  options: {
    useTimestamps: true,
  },
  attributes: {
    user: {
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
