const { assetsFiles } = require('../../tables');

module.exports = function getFiles(asset, { transacting } = {}) {
  return assetsFiles
    .find(
      {
        asset,
      },
      { transacting }
    )
    .then((files) => files.map((file) => file.file));
};
