module.exports = {
  modelName: 'program-subjects-credits',
  collectionName: 'program-subjects-credits',
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
    // Curso solo seteado si el internalId tiene especificado un curso
    course: {
      references: {
        collection: 'plugins_academic-portfolio::groups',
      },
    },
    credits: {
      type: 'integer',
    },
    internalId: {
      type: 'string',
    },
    compiledInternalId: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
