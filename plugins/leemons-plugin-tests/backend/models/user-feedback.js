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
    toUserAgent: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
    fromUserAgent: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const userFeedbackModel = newModel(mongoose.connection, 'v1::tests_UserFedback', schema);

module.exports = { userFeedbackModel };
