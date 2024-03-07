const { mongoose, newModel } = require('@leemons/mongodb');

const gradesSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
    },
    assignation: {
      type: String,
      required: true,
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

gradesSchema.index({ assignation: 1, deploymentID: 1, isDeleted: 1 });
gradesSchema.index({ assignation: 1, type: 1, deploymentID: 1, isDeleted: 1 });
gradesSchema.index({ assignation: 1, visibleToStudent: 1, deploymentID: 1, isDeleted: 1 });
gradesSchema.index({ assignation: 1, subject: 1, deploymentID: 1, isDeleted: 1 });
gradesSchema.index({ type: 1, date: 1, deploymentID: 1, isDeleted: 1 });

const gradesModel = newModel(mongoose.connection, 'v1::assignables_Grades', gradesSchema);

module.exports = { gradesSchema, gradesModel };
