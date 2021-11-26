module.exports = {
  modelName: 'classroom-level-calendars',
  collectionName: 'classroom-level-calendars',
  options: {
    useTimestamps: true,
  },
  attributes: {
    calendar: {
      references: {
        collection: 'plugins_calendar::calendars',
      },
    },
    level: {
      references: {
        collection: 'plugins_classroom::levels',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
