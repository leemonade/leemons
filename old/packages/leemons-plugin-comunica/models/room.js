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
      type: 'text',
      textType: 'mediumText',
    },
    subName: {
      type: 'string',
    },
    parentRoom: {
      type: 'text',
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
    metadata: {
      type: 'text',
      textType: 'mediumText',
    },
    program: {
      type: 'string',
    },
    center: {
      type: 'string',
    },
    adminDisableMessages: {
      type: 'boolean',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
