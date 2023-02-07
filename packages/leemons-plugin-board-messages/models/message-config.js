module.exports = {
  modelName: 'message-config',
  collectionName: 'message-config',
  options: {
    useTimestamps: true,
  },
  attributes: {
    internalName: {
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
