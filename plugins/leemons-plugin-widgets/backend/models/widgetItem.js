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
    url: {
      type: String,
      required: true,
    },
    pluginName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
    },
    properties: {
      type: String,
    },
    path: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

schema.index({ zoneKey: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ key: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ zoneKey: 1, key: 1, deploymentID: 1, isDeleted: 1 });
schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const widgetItemModel = newModel(mongoose.connection, 'v1::widgets_WidgetItem', schema);

module.exports = { widgetItemModel };
