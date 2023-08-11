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
    number: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    letter: {
      type: String,
    },
    grade: {
      // ref: 'plugins_grades::grades',
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

const gradeScalesModel = newModel(mongoose.connection, 'v1::grades_gradeScales', schema);

module.exports = { gradeScalesModel };
