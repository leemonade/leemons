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
    questionBank: {
      type: String,
      // ref: 'plugins_tests::questions-banks',
    },
    subject: {
      type: String,
      // ref: 'plugins_academic-portfolio::subjects',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const questionBankSubjectsModel = newModel(
  mongoose.connection,
  'v1::tests_QuestionBankSubjects',
  schema
);

module.exports = { questionBankSubjectsModel };
