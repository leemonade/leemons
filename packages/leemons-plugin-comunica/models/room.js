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
    name: {
      type: 'string',
    },
    subName: {
      type: 'string',
    },
    parentRoom: {
      type: 'string',
    },
    useEncrypt: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
