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
    credits: {
      type: 'integer',
    },
    internalId: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
