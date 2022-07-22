module.exports = {
  modelName: 'room',
  collectionName: 'room',
  options: {
    useTimestamps: true,
  },
  attributes: {
    key: {
      type: 'string',
      options: {
        notNull: true,
        unique: true,
      },
    },
    useEncrypt: {
      type: 'boolean',
    }
  },
  primaryKey: {
    type: 'uuid',
  },
};
