module.exports = {
  modelName: 'questions',
  collectionName: 'questions',
  options: {
    useTimestamps: true,
  },
  attributes: {
    references: {
      collection: 'plugins_tests::questions-banks',
    },
    type: {
      type: 'string',
    },
    level: {
      type: 'string',
    },
    question: {
      type: 'string',
      required: true,
    },
    clues: {
      type: 'json',
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
