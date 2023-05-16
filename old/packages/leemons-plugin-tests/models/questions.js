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
      type: 'text',
      required: true,
    },
    questionImage: {
      type: 'string',
    },
    clues: {
      type: 'text',
      textType: 'mediumText',
    },
    category: {
      references: {
        collection: 'plugins_tests::question-bank-categories',
      },
    },
    // ES: Aqui se almacena toda la configuración adicional segun el tipo de pregunta
    properties: {
      type: 'text',
      textType: 'mediumText',
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
