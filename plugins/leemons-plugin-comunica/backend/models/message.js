const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
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
    minimize: false,
  }
);

schema.index({ room: 1, deploymentID: 1, isDeleted: 1 });

const messageModel = newModel(mongoose.connection, 'v1::comunica_Message', schema);

module.exports = { messageModel };
