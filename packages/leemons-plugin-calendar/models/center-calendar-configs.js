module.exports = {
  modelName: 'center-calendar-configs',
  collectionName: 'center-calendar-configs',
  options: {
    useTimestamps: true,
  },
  attributes: {
    center: {
      references: {
        collection: 'plugins_users::centers',
      },
    },
    config: {
      references: {
        collection: 'plugins_calendar::calendar-configs',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
