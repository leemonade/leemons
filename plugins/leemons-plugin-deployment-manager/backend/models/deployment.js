const { mongoose, newModel } = require('@leemons/mongodb');

const deploymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    domains: {
      type: [String],
      required: true,
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
    },
    type: {
      type: String,
      required: true,
      default: 'free',
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

deploymentSchema.index({ id: 1, isDeleted: 1 });
deploymentSchema.index({ domains: 1, isDeleted: 1 });

const deploymentModel = newModel(
  mongoose.connection,
  'package-manager_Deployment',
  deploymentSchema
);

module.exports = { deploymentModel };
