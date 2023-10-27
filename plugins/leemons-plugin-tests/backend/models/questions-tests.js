const { mongoose, newModel } = require('@leemons/mongodb');

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
    test: {
      // ref: 'plugins_tests::tests',
      type: String,
    },
    question: {
      // ref: 'plugins_tests::questions',
      type: String,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const questionsTestsModel = newModel(mongoose.connection, 'v1::tests_QuestionsTests', schema);

module.exports = { questionsTestsModel };
