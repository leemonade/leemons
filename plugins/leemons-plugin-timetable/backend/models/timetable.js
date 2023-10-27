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
    //
    class: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    dayWeek: {
      type: Number,
      required: true,
    },
    start: {
      // type: 'time',
      type: String,
      required: true,
    },
    end: {
      // type: 'time',
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const timetableModel = newModel(mongoose.connection, 'v1::timetable_Timetable', schema);

module.exports = { timetableModel };
