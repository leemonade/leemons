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
      required: true,
      /*
      references: {
        collection: 'plugins_comunica::message',
      }
      */
    },
    count: {
      type: Number,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ room: 1, userAgent: 1, deploymentID: 1, isDeleted: 1 });

const roomMessagesUnReadModel = newModel(
  mongoose.connection,
  'v1::comunica_RoomMessagesUnRead',
  schema
);

module.exports = { roomMessagesUnReadModel };
