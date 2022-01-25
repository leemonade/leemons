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
    duration: {
      type: 'integer',
      options: {
        required: true,
      },
    },
  },
};
