module.exports = {
  modelName: 'calendars',
  collectionName: 'calendars',
  options: {
    useTimestamps: true,
  },
  attributes: {
    key: {
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
    icon: {
      type: 'string',
    },
    bgColor: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    borderColor: {
      type: 'string',
    },
    section: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    metadata: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
