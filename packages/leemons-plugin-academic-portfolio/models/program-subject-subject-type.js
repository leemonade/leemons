module.exports = {
  modelName: 'program-subject-subject-type',
  collectionName: 'program-subject-subject-type',
  options: {
    useTimestamps: true,
  },
  attributes: {
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
    subject: {
      references: {
        collection: 'plugins_academic-portfolio::subjects',
      },
    },
    subjectType: {
      references: {
        collection: 'plugins_academic-portfolio::subject-types',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
