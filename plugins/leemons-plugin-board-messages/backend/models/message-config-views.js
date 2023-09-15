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
    messageConfig: {
      type: String,
      // ref: 'plugins_board-messages::message-config',
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const messageConfigViewsModel = newModel(
  mongoose.connection,
  'v1::board-messages_MessageConfigViews',
  schema
);

module.exports = { messageConfigViewsModel };
