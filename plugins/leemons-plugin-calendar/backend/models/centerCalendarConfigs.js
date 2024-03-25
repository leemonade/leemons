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
    minimize: false,
  }
);

schema.index({ deploymentID: 1, isDeleted: 1, center: 1 });
schema.index({ deploymentID: 1, isDeleted: 1, config: 1 });

const centerCalendarConfigsModel = newModel(
  mongoose.connection,
  'v1::calendar_centerCalendarConfigs',
  schema
);

module.exports = { centerCalendarConfigsModel };
