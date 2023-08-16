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
    program: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messageConfigProgramsModel = newModel(
  mongoose.connection,
  'v1::board-messages_MessageConfigPrograms',
  schema
);

module.exports = { messageConfigProgramsModel };
