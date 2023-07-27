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
  },
  {
    timestamps: true,
  }
);

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

const widgetItemModel = newModel(mongoose.connection, 'v1::widgets_WidgetItem', schema);

module.exports = { widgetItemModel };
