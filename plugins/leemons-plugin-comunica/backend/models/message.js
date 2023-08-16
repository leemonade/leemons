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
    room: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
      /*
      references: {
        collection: 'plugins_users::user-agent',
      }
      */
    },
    message: {
      type: String,
    },
    isEncrypt: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = newModel(mongoose.connection, 'v1::comunica_Message', schema);

module.exports = { messageModel };
