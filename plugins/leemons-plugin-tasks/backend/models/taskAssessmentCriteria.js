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
    task: {
      type: String,
    },
    assessmentCriteria: {
      type: String,
    },
    subject: {
      type: String, // uuid
    },
    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const taskAssessmentCriteriaModel = newModel(
  mongoose.connection,
  'v1::tasks_TaskAssessmentCriteria',
  schema
);

module.exports = { taskAssessmentCriteriaModel };
