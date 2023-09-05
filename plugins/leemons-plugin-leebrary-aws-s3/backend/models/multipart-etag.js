const { mongoose, newModel } = require('leemons-mongodb');
const { pluginName } = require('../config/constants');

const schema = new mongoose.Schema(
  {
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
  }
);

const multipartEtagModel = newModel(mongoose.connection, `v1::${pluginName}_MultipartEtag`, schema);

module.exports = { multipartEtagModel };
