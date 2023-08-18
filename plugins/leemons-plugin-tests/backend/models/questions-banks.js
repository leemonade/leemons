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
    name: {
      type: String,
      required: true,
    },
    program: {
      // ref: 'plugins_academic-portfolio::programs',
      type: String,
    },
    published: {
      type: Boolean,
      default: false,
    },
    asset: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const questionsBanksModel = newModel(mongoose.connection, 'v1::tests_QuestionsBanks', schema);

module.exports = { questionsBanksModel };
