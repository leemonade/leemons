const { getS3AndConfig } = require('./getS3AndConfig');
const { getReadStream } = require('./getReadStream');
const { getConfig } = require('./getConfig');
const { setConfig } = require('./setConfig');
const { upload } = require('./upload');
const { remove } = require('./remove');

module.exports = {
  getS3AndConfig,
  getReadStream,
  getConfig,
  setConfig,
  upload,
  remove,
};
