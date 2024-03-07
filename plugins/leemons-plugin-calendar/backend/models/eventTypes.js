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
    onlyOneDate: {
      type: Boolean,
    },
    order: {
      type: Number,
    },
    config: {
      type: String,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

const eventTypesModel = newModel(mongoose.connection, 'v1::calendar_eventTypes', schema);

module.exports = { eventTypesModel };
