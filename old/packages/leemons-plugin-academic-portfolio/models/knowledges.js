module.exports = {
  modelName: 'knowledges',
  collectionName: 'knowledges',
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
    abbreviation: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    color: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    icon: {
      type: 'string',
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
