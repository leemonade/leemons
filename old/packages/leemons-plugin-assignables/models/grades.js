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
      type: 'decimal',
      scale: 7,
      precision: 7 - 2 + 8, // scale - defaultScale + defaultPrecision
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
    visibleToStudent: {
      type: 'boolean',
      options: {
        notNull: true,
        defaultTo: true,
      },
    },
    date: {
      type: 'datetime',
    },
  },
};
