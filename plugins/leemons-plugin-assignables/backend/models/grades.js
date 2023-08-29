const { mongoose, newModel } = require('leemons-mongodb');

const gradesSchema = new mongoose.Schema(
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
    assignation: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
    },
    gradedBy: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
    },
    visibleToStudent: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const gradesModel = newModel(mongoose.connection, 'v1::assignables_Grades', gradesSchema);

module.exports = { gradesSchema, gradesModel };
