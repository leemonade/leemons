const { mongoose, newModel } = require('leemons-mongodb');
const { pluginName } = require('../config/constants');

const configSchema = new mongoose.Schema(
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
    bucket: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    accessKey: {
      type: String,
      required: true,
    },
    secretAccessKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const configModel = newModel(mongoose.connection, `v1::${pluginName}_Config`, configSchema);

module.exports = { configSchema, configModel };
