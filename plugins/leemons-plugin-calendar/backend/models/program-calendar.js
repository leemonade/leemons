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
    // ref: plugins_calendar::calendars
    calendar: {
      type: String,
    },
    // ref: plugins_academic-portfolio::programs
    program: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const programCalendarModel = newModel(mongoose.connection, 'v1::calendar_program-calendar', schema);

module.exports = { programCalendarModel };
