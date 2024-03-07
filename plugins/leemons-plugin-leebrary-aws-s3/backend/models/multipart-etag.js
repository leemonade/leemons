const { mongoose, newModel } = require('@leemons/mongodb');
const { pluginName } = require('../config/constants');

const multipartEtagSchema = new mongoose.Schema(
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
    fileId: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
    etag: {
      type: String,
      required: true,
    },
    partNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const multipartEtagModel = newModel(
  mongoose.connection,
  `v1::${pluginName}_MultipartEtag`,
  multipartEtagSchema
);

module.exports = { multipartEtagSchema, multipartEtagModel };
