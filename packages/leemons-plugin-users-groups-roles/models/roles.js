module.exports = {
  modelName: 'roles',
  collectionName: 'roles',
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
  },
  primaryKey: {
    type: 'uuid',
  },
};
