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
    minimize: false,
  }
);

const messageConfigClicksModel = newModel(
  mongoose.connection,
  'v1::board-messages_MessageConfigClicks',
  schema
);

module.exports = { messageConfigClicksModel };
