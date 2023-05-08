const provider = require('../src/services/provider');
const data = require('../config/data');

module.exports = {
  data,
  uploadMultipartChunk: provider.uploadMultipartChunk,
  finishMultipart: provider.finishMultipart,
  abortMultipart: provider.abortMultipart,
  newMultipart: provider.newMultipart,
  getReadStream: provider.getReadStream,
  removeConfig: provider.removeConfig,
  setConfig: provider.setConfig,
  upload: provider.upload,
  remove: provider.remove,
  clone: provider.clone,
};
