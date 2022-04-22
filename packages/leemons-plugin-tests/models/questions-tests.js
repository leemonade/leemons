module.exports = {
  modelName: 'questions-tests',
  collectionName: 'questions-tests',
  options: {
    useTimestamps: true,
  },
  attributes: {
    test: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_tests::tests',
      },
       */
    },
    question: {
      references: {
        collection: 'plugins_tests::questions',
      },
    },
    order: {
      type: 'number',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
