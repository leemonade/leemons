const { mongoose, newModel } = require('@leemons/mongodb');

const assignationsSchema = new mongoose.Schema(
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
      default: null,
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
    minimize: false,
  }
);

assignationsSchema.index({ instance: 1, user: 1, deploymentID: 1, isDeleted: 1 });
assignationsSchema.index({ instance: 1, deploymentID: 1, isDeleted: 1 });
assignationsSchema.index({ user: 1, deploymentID: 1, isDeleted: 1 });
assignationsSchema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const assignationsModel = newModel(
  mongoose.connection,
  'v1::assignables_Assignations',
  assignationsSchema
);

module.exports = { assignationsSchema, assignationsModel };
