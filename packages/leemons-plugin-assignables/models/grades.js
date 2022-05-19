module.exports = {
  modelName: 'grades',
  attributes: {
    assignation: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    subject: {
      type: 'uuid',
    },
    type: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    grade: {
      type: 'float',
      options: {
        notNull: true,
      },
    },
    gradedBy: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    feedback: {
      type: 'richtext',
    },
    date: {
      type: 'datetime',
    },
  },
};
