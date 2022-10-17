module.exports = {
  modelName: 'scores',
  attributes: {
    class: {
      type: 'string',
      length: 36 * 2 + 1, // uuid.uuid
    },
    student: {
      type: 'uuid',
      options: { notNull: true },
    },
    period: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    published: {
      type: 'boolean',
      options: {
        defaultValue: false,
      },
    },
    gradedBy: {
      type: 'uuid',
      options: {
        notNull: true,
      },
    },
    gradedAt: {
      type: 'datetime',
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
  },
};
