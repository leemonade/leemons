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
    key: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
schema.index({ deploymentID: 1, key: 1 }, { unique: true });

const widgetZoneModel = newModel(mongoose.connection, 'v1::widgets_widgetZone', schema);

module.exports = { widgetZoneModel };
