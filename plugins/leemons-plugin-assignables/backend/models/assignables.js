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
    },
    submission: {
      type: mongoose.Schema.Types.Mixed,
    },
    instructionsForTeachers: {
      type: String,
    },
    instructionsForStudents: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const assignablesModel = newModel(mongoose.connection, 'v1::assignables_Assignables', schema);

module.exports = { assignablesModel };
