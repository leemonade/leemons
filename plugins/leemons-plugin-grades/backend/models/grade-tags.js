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
    description: {
      type: String,
      required: true,
    },
    letter: {
      type: String,
      required: true,
    },
    scale: {
      // ref: 'plugins_grades::grade-scales',
      type: String,
    },
    grade: {
      // ref: 'plugins_grades::grades',
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const gradeTagsModel = newModel(mongoose.connection, 'v1::grades_gradeTags', schema);

module.exports = { gradeTagsModel };
