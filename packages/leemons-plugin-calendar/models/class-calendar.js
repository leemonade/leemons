module.exports = {
  modelName: 'class-calendar',
  collectionName: 'class-calendar',
  options: {
    useTimestamps: true,
  },
  attributes: {
    calendar: {
      references: {
        collection: 'plugins_calendar::calendars',
      },
    },
    class: {
      references: {
        collection: 'plugins_academic-portfolio::class',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
