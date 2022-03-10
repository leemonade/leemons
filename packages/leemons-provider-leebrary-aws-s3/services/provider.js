const provider = require('../src/services/provider');

module.exports = {
  getReadStream: provider.getReadStream,
  setConfig: provider.setConfig,
  upload: provider.upload,
  remove: provider.remove,
};
