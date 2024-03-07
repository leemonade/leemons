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
      // ref: 'plugins_board-messages::message-config',
    },
    profile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const messageConfigProfilesModel = newModel(
  mongoose.connection,
  'v1::board-messages_MessageConfigProfiles',
  schema
);

module.exports = { messageConfigProfilesModel };
