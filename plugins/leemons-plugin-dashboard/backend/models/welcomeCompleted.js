const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    deploymentID: {
      type: String,
      required: true,
    },

    userAgent: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const WelcomeCompletedModel = newModel(
  mongoose.connection,
  'v1::dashboard_welcome_completed',
  schema
);

module.exports = { WelcomeCompletedModel };
