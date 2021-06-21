module.exports = {
  modelName: 'actions',
  collectionName: 'actions',
  options: {
    useTimestamps: true,
  },
  attributes: {
    actionName: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    order: {
      type: 'integer',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
