const { mongoose, newModel } = require('@leemons/mongodb');

const instancesSchema = new mongoose.Schema(
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
    assignable: {
      type: String,
      required: true,
    },
    alwaysAvailable: {
      type: Boolean,
      required: true,
    },
    duration: {
      type: String,
    },
    gradable: {
      type: Boolean,
      required: true,
      default: false,
    },
    requiresScoring: {
      type: Boolean,
      required: true,
      default: false,
    },
    allowFeedback: {
      type: Boolean,
      required: true,
      default: false,
    },
    showResults: {
      type: Boolean,
      required: true,
      default: true,
    },
    showCorrectAnswers: {
      type: Boolean,
      required: true,
      default: true,
    },
    sendMail: {
      type: Boolean,
    },
    messageToAssignees: {
      type: String,
    },
    curriculum: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    relatedAssignableInstances: {
      type: mongoose.Schema.Types.Mixed,
      default: { before: [], after: [] },
    },
    event: {
      type: String,
    },
    addNewClassStudents: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

instancesSchema.index({ id: 1, addNewClassStudents: 1, deploymentID: 1, isDeleted: 1 });
instancesSchema.index({ id: 1, deploymentID: 1, isDeleted: 1 });
instancesSchema.index({ id: 1, 'metadata.module.type': 1, deploymentID: 1, isDeleted: 1 });

const instancesModel = newModel(mongoose.connection, 'v1::assignables_Instances', instancesSchema);

module.exports = { instancesSchema, instancesModel };
