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
    nameReplaces: {
      type: 'string',
    },
    subName: {
      type: 'string',
    },
    parentRoom: {
      type: 'string',
    },
    image: {
      type: 'string',
    },
    icon: {
      type: 'string',
    },
    bgColor: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    initDate: {
      type: 'datetime',
    },
    useEncrypt: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
