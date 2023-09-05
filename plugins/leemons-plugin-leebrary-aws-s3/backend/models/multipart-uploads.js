const { mongoose, newModel } = require('leemons-mongodb');
const { pluginName } = require('../config/constants');

const schema = new mongoose.Schema(
  {
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
  schema
);

module.exports = { multipartUploadsModel };
