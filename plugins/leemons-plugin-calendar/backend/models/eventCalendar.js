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
    // ref: plugins_calendar::calendars
    calendar: {
      type: String,
    },
    // ref: plugins_calendar::events
    event: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ calendar: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ event: 1, deploymentID: 1, isDeleted: 1 });

const eventCalendarModel = newModel(mongoose.connection, 'v1::calendar_eventCalendar', schema);

module.exports = { eventCalendarModel };
