module.exports = {
  modelName: 'cycles',
  collectionName: 'cycles',
  options: {
    useTimestamps: true,
  },
  attributes: {
    name: {
      type: 'string',
    },
    program: {
      references: {
        collection: 'plugins_academic-portfolio::programs',
      },
    },
    courses: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
