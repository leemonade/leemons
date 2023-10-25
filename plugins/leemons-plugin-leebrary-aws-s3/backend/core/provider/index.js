const { uploadMultipartChunk } = require('./uploadMultipartChunk');
const { finishMultipart } = require('./finishMultipart');
const { abortMultipart } = require('./abortMultipart');
const { getS3AndConfig } = require('./getS3AndConfig');
const { getReadStream } = require('./getReadStream');
const { removeConfig } = require('./removeConfig');
const { newMultipart } = require('./newMultipart');
const { getConfig } = require('./getConfig');
const { setConfig } = require('./setConfig');
const { upload } = require('./upload');
const { remove } = require('./remove');
const { clone } = require('./clone');

module.exports = {
  uploadMultipartChunk,
  finishMultipart,
  abortMultipart,
  getS3AndConfig,
  getReadStream,
  removeConfig,
  newMultipart,
  getConfig,
  setConfig,
  upload,
  remove,
  clone,
};
