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
    // The reference to the timetable this break belongs to
    timetable: {
      // ref: 'plugins_timetable::config',
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    // The timespan this break covers
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
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const breaksModel = newModel(mongoose.connection, 'v1::timetable_Breaks', schema);

module.exports = { breaksModel };
