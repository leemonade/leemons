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
    name: {
      type: String,
    },
    center: {
      type: String,
    },
    regionalEventsRel: {
      type: String,
    },
    regionalEvents: {
      type: String,
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
    localEvents: {
      type: String,
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
    daysOffEvents: {
      type: String,
      // [{name: 'Recreo',  startDate: Date, endDate: Date}]
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const regionalConfigModel = newModel(
  mongoose.connection,
  'v1::academic-calendar_RegionalConfig',
  schema
);

module.exports = { regionalConfigModel };
