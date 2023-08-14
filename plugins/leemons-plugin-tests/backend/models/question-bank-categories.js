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
    category: {
      type: String,
    },
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const questionBankCategoriesModel = newModel(
  mongoose.connection,
  'v1::tests_QuestionBankCategories',
  schema
);

module.exports = { questionBankCategoriesModel };
