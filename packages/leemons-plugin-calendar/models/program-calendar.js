module.exports = {
  modelName: 'program-calendar',
  collectionName: 'program-calendar',
  options: {
    useTimestamps: true,
  },
  attributes: {
    calendar: {
      references: {
        collection: 'plugins_calendar::calendars',
      },
    },
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
