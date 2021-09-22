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
  },
  primaryKey: {
    type: 'uuid',
  },
};
