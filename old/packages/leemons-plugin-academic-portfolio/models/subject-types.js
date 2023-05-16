module.exports = {
  modelName: 'subject-types',
  collectionName: 'subject-types',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    groupVisibility: {
      type: 'boolean',
      options: {
        notNull: true,
      },
    },
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
    credits_course: {
      type: 'integer',
    },
    credits_program: {
      type: 'integer',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
