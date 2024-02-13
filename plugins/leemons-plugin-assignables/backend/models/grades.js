const { mongoose, newModel } = require('@leemons/mongodb');

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
      default: null,
    },
    visibleToStudent: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

gradesSchema.index({ deploymentID: 1, assignation: 1, subject: 1, type: 1 }, { unique: true });

const gradesModel = newModel(mongoose.connection, 'v1::assignables_Grades', gradesSchema);

module.exports = { gradesSchema, gradesModel };
