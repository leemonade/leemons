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
    assignable: {
      type: String,
    },
    type: {
      type: String,
    },
    required: {
      type: Boolean,
    },
    order: {
      type: Number,
    },
    question: {
      type: String,
      required: true,
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

const feedbackQuestionsModel = newModel(
  mongoose.connection,
  'v1::feedback_feedbackQuestions',
  schema
);

module.exports = { feedbackQuestionsModel };
