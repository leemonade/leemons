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
    },
    questionBank: {
      type: String,
    },
    type: {
      type: String,
    },
    level: {
      type: String,
    },
    statement: {
      type: String,
    },
    instructionsForTeacher: {
      type: String,
    },
    instructionsForStudent: {
      type: String,
    },
    filters: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const testsModel = newModel(mongoose.connection, 'v1::tests_TestsModel', schema);

module.exports = { testsModel };
