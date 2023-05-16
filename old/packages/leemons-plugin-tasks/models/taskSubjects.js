module.exports = {
  modelName: 'taskSubjects',
  attributes: {
    task: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    course: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    subject: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    level: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
  },
};
