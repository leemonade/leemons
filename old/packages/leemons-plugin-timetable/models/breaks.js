module.exports = {
  attributes: {
    // The reference to the timetable this break belongs to
    timetable: {
      references: {
        collection: 'plugins_timetable::config',
      },
    },
    name: {
      type: 'string',
      options: {
        required: true,
        minLength: 1,
      },
    },
    // The timespan this break covers
    start: {
      type: 'time',
      options: {
        required: true,
      },
    },
    end: {
      type: 'time',
      options: {
        required: true,
      },
    },
  },
};
