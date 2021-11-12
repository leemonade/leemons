module.exports = {
  modelName: 'config',
  attributes: {
    // The timespan this timetable covers
    days: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    start: {
      type: 'time',
      options: {
        notNull: true,
      },
    },
    end: {
      type: 'time',
      options: {
        notNull: true,
      },
    },
    slot: {
      type: 'integer',
      options: {
        notNull: true,
      },
    },
    // The identifiers of the timetable (should be unique)
    entities: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    entityTypes: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
};
