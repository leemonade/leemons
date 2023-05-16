module.exports = {
  modelName: 'notifications',
  collectionName: 'notifications',
  options: {
    useTimestamps: true,
  },
  attributes: {
    event: {
      references: {
        collection: 'plugins_calendar::events',
      },
    },
    date: {
      type: 'datetime',
      options: {
        notNull: true,
      },
    },
    state: {
      type: 'enum',
      enum: ['active', 'sending', 'sended', 'error'],
      options: {
        notNull: true,
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
