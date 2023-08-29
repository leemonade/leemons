const { mongoose, newModel } = require('leemons-mongodb');

const assignationsSchema = new mongoose.Schema(
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
    instance: {
      type: String,
      required: true,
    },
    indexable: {
      type: Boolean,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    classes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    emailSended: {
      type: Boolean,
      default: false,
    },
    rememberEmailSended: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const assignationsModel = newModel(
  mongoose.connection,
  'v1::assignables_Assignations',
  assignationsSchema
);

module.exports = { assignationsSchema, assignationsModel };
