module.exports = {
  modelName: 'subjects',
  attributes: {
    assignable: {
      // TODO: Convert to relation
      type: 'string',
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
      type: 'json',
    },
  },
};
