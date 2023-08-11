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
    //
    instance: {
      // ref: 'plugins_assignables::assignableInstances',
      type: String,
    },
    userAgent: {
      // ref: 'plugins_users::user-agent',
      type: String,
    },
    question: {
      // ref: 'plugins_feedback::feedback-questions',
      type: String,
    },
    response: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const feedbackResponsesModel = newModel(
  mongoose.connection,
  'v1::feedback_feedbackResponses',
  schema
);

module.exports = { feedbackModel: feedbackResponsesModel };
