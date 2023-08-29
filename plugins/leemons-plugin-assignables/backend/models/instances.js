const { mongoose, newModel } = require('leemons-mongodb');

const instancesSchema = new mongoose.Schema(
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

    assignable: {
      type: String,
      required: true,
      index: true,
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
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    relatedAssignableInstances: {
      type: mongoose.Schema.Types.Mixed,
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
  }
);

const instancesModel = newModel(mongoose.connection, 'v1::assignables_Instances', instancesSchema);

module.exports = { instancesSchema, instancesModel };
