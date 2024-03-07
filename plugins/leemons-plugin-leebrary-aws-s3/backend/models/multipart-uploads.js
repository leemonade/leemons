const { mongoose, newModel } = require('@leemons/mongodb');
const { pluginName } = require('../config/constants');

const multipartUploadsSchema = new mongoose.Schema(
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
    minimize: false,
  }
);

multipartUploadsSchema.index({ fileId: 1, deploymentID: 1, isDeleted: 1 });

const multipartUploadsModel = newModel(
  mongoose.connection,
  `v1::${pluginName}_MultipartUploads`,
  multipartUploadsSchema
);

module.exports = { multipartUploadsSchema, multipartUploadsModel };
