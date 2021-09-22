module.exports = {
  modelName: 'events',
  collectionName: 'events',
  options: {
    useTimestamps: true,
  },
  attributes: {
    title: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    calendar: {
      references: {
        collection: 'plugins_calendar::calendars',
      },
    },
    startDate: {
      type: 'datetime',
      options: {
        notNull: true,
      },
    },
    endDate: {
      type: 'datetime',
      options: {
        notNull: true,
      },
    },
    isAllDay: {
      type: 'boolean',
    },
    repeat: {
      type: 'string',
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    data: {
      type: 'json',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
