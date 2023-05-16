module.exports = {
  modelName: 'subjects',
  attributes: {
    assignable: {
      // TODO: Convert to relation
      type: 'string',
    },
    program: {
      type: 'uuid',
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
    },
    curriculum: {
      type: 'text',
      textType: 'mediumText',
    },
  },
};
