module.exports = {
  modelName: 'question-bank-categories',
  collectionName: 'question-bank-categories',
  options: {
    useTimestamps: true,
  },
  attributes: {
    questionBank: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_tests::questions-banks',
      },
       */
    },
    category: {
      type: 'string',
    },
    order: {
      type: 'number',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
