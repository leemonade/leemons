const { findByAssetIds, save } = require('../src/services/questions-banks');

module.exports = {
  findByAssetIds,
  // TODO: Remove save once the MVP-template is not needed anymore
  save,
};
