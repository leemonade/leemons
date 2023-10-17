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
    class: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messageConfigClassesModel = newModel(
  mongoose.connection,
  'v1::board-messages_MessageConfigClasses',
  schema
);

module.exports = { messageConfigClassesModel };
