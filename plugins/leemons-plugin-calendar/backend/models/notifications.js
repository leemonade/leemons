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
    // ref: plugins_calendar::events
    event: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: ['active', 'sending', 'sended', 'error'],
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const notificationsModel = newModel(mongoose.connection, 'v1::calendar_notifications', schema);

module.exports = { notificationsModel };
