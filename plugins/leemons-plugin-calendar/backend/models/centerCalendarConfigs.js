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
    // ref: plugins_users::centers
    center: {
      type: String,
    },
    // ref: plugins_calendar::calendar-configs
    config: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const centerCalendarConfigsModel = newModel(
  mongoose.connection,
  'v1::calendar_centerCalendarConfigs',
  schema
);

module.exports = { centerCalendarConfigsModel };
