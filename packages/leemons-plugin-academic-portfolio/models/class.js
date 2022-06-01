module.exports = {
  modelName: 'class',
  collectionName: 'class',
  options: {
    useTimestamps: true,
  },
  attributes: {
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
    subjectType: {
      references: {
        collection: 'plugins_academic-portfolio::subject-types',
      },
    },
    subject: {
      references: {
        collection: 'plugins_academic-portfolio::subjects',
      },
    },
    class: {
      references: {
        collection: 'plugins_academic-portfolio::class',
      },
    },
    classroom: {
      type: 'string',
    },
    seats: {
      type: 'integer',
    },
    image: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    virtualUrl: {
      type: 'string',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
