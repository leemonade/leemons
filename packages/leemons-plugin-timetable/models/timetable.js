module.exports = {
  modelName: 'timetable',
  attributes: {
    class: {
      type: 'uuid',
      options: {
        required: true,
      },
    },
    day: {
      type: 'string',
      options: {
        required: true,
      },
    },
    dayWeek: {
      type: 'integer',
      options: {
        required: true,
      },
    },
    start: {
      // type: 'time',
      type: 'string',
      options: {
        required: true,
      },
    },
    end: {
      // type: 'time',
      type: 'string',
      options: {
        required: true,
      },
    },
    duration: {
      type: 'integer',
      options: {
        required: true,
      },
    },
  },
};
