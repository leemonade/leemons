const { mongoose, newModel } = require('leemons-mongodb');
const { pluginName } = require('../config/constants');

const multipartUploadsSchema = new mongoose.Schema(
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
    uploadId: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const multipartUploadsModel = newModel(
  mongoose.connection,
  `v1::${pluginName}_MultipartUploads`,
  multipartUploadsSchema
);

module.exports = { multipartUploadsSchema, multipartUploadsModel };
