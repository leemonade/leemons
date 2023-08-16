const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    //
    questionBank: {
      // ref: 'plugins_tests::questions-banks',
      type: String,
    },
    type: {
      type: String,
    },
    withImages: {
      type: Boolean,
    },
    level: {
      type: String,
    },
    question: {
      type: String,
      required: true,
    },
    questionImage: {
      type: String,
    },
    clues: {
      type: String,
    },
    category: {
      // ref : 'plugins_tests::question-bank-categories',
      type: String,
    },
    // ES: Aqui se almacena toda la configuración adicional segun el tipo de pregunta
    properties: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const questionsModel = newModel(mongoose.connection, 'v1::tests_Questions', schema);

module.exports = { questionsModel };
