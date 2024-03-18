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
    minimize: false,
  }
);

schema.index({ key: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ zoneKey: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ zoneKey: 1, key: 1, deploymentID: 1, isDeleted: 1 });

const widgetItemProfilesModel = newModel(
  mongoose.connection,
  'v1::widgets_WidgetItemProfiles',
  schema
);

module.exports = { widgetItemProfilesModel };
