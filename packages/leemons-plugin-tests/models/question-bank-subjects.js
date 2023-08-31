module.exports = {
  modelName: 'question-bank-subjects',
  collectionName: 'question-bank-subjects',
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
    subject: {
      type: 'string',
      /*
      references: {
        collection: 'plugins_academic-portfolio::subjects',
      },
      */
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
