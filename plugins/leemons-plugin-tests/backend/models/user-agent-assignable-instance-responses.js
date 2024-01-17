const { mongoose, newModel } = require('@leemons/mongodb');

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
    //
    instance: {
      // ref: 'plugins_assignables::assignableInstances',
      type: String,
    },
    question: {
      // ref: 'plugins_tests::questions',
      type: String,
    },
    userAgent: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
    clues: {
      type: Number,
    },
    cluesTypes: {
      type: mongoose.Schema.Types.Mixed,
    },
    // ok | ko | null
    status: {
      type: String,
    },
    points: {
      type: Number,
    },
    properties: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const UserAgentAssignableInstanceResponsesModel = newModel(
  mongoose.connection,
  'v1::tests_UserAgentAssignableInstanceResponses',
  schema
);

module.exports = { UserAgentAssignableInstanceResponsesModel };
