module.exports = {
  modelName: 'questions',
  collectionName: 'questions',
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
    type: {
      type: 'string',
    },
    withImages: {
      type: 'boolean',
    },
    level: {
      type: 'string',
    },
    question: {
      type: 'string',
      required: true,
    },
    questionImage: {
      type: 'string',
    },
    clues: {
      type: 'json',
    },
    category: {
      references: {
        collection: 'plugins_tests::question-bank-categories',
      },
    },
    // ES: Aqui se almacena toda la configuración adicional segun el tipo de pregunta
    properties: {
      type: 'json',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
