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
  }
);

schema.index({ deploymentID: 1, key: 1 }, { unique: true });

const eventTypesModel = newModel(mongoose.connection, 'v1::calendar_event-types', schema);

module.exports = { eventTypesModel };
