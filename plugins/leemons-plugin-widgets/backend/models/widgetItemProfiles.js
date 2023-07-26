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
    //
    zoneKey: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const widgetItemProfilesModel = newModel(
  mongoose.connection,
  'v1::widgets_WidgetItemProfiles',
  schema
);

module.exports = { widgetItemProfilesModel };
