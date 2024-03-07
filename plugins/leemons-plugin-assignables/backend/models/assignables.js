const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
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
    asset: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    gradable: {
      type: Boolean,
      required: true,
    },
    center: {
      type: String,
    },
    statement: {
      type: String,
    },
    development: {
      type: String,
    },
    duration: {
      type: String,
    },
    resources: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    submission: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    instructionsForTeachers: {
      type: String,
    },
    instructionsForStudents: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ asset: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ asset: 1, role: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ 'submission.activities.activity': 1, deploymentID: 1, isDeleted: 1 });

const assignablesModel = newModel(mongoose.connection, 'v1::assignables_Assignables', schema);

module.exports = { assignablesSchema: schema, assignablesModel };
