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
    muted: {
      type: Boolean,
    },
    attached: {
      type: Date,
    },
    encryptKey: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
    },
    adminMuted: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const userAgentInRoomModel = newModel(mongoose.connection, 'v1::comunica_UserAgentInRoom', schema);

module.exports = { userAgentInRoomModel };
