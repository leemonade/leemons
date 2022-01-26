module.exports = {
  modelName: 'event-calendar',
  collectionName: 'event-calendar',
  options: {
    useTimestamps: true,
  },
  attributes: {
    calendar: {
      references: {
        collection: 'plugins_calendar::calendars',
      },
    },
    event: {
      references: {
        collection: 'plugins_calendar::events',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
