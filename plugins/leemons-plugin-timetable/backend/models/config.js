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
    // The timespan this timetable covers
    days: {
      type: String,
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
      options: {
        notNull: true,
      },
    },
    slot: {
      type: Number,
      required: true,
    },
    // The identifiers of the timetable (should be unique)
    entities: {
      type: String,
      required: true,
    },
    entityTypes: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);
const configModel = newModel(mongoose.connection, 'v1::timetable_Config', schema);

module.exports = { configModel };
