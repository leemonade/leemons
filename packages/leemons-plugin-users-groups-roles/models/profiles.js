module.exports = {
  modelName: 'profiles',
  collectionName: 'profiles',
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
