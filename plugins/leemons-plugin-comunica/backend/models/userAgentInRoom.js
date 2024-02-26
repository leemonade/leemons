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
    minimize: false,
  }
);

schema.index({ room: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ userAgent: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ room: 1, userAgent: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const userAgentInRoomModel = newModel(mongoose.connection, 'v1::comunica_UserAgentInRoom', schema);

module.exports = { userAgentInRoomModel };
