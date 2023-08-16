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
    messageConfig: {
      type: String,
      // ref: 'plugins_board-messages::message-config',
    },
    center: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messageConfigCentersModel = newModel(
  mongoose.connection,
  'v1::board-messages_MessageConfigCenters',
  schema
);

module.exports = { messageConfigCentersModel };
