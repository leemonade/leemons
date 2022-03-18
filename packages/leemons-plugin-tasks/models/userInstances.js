module.exports = {
  modelName: 'userInstances',
  attributes: {
    instance: {
      type: 'uuid',
    },
    user: {
      type: 'uuid',
    },
    opened: {
      type: 'datetime',
    },
    start: {
      type: 'datetime',
    },
    end: {
      type: 'datetime',
    },
    grade: {
      type: 'integer',
    },
    teacherFeedback: {
      type: 'richtext',
    },
  },
};
