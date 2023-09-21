const { mongoose, newModel } = require('@leemons/mongodb');

const deploymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    domains: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const deploymentModel = newModel(
  mongoose.connection,
  'package-manager_Deployment',
  deploymentSchema
);

module.exports = { deploymentModel };
