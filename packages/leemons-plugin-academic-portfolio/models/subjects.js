module.exports = {
  modelName: 'subjects',
  collectionName: 'subjects',
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
    internalId: {
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
    course: {
      references: {
        collection: 'plugins_academic-portfolio::groups',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
