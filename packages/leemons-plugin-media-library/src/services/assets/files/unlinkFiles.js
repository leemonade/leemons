const { assetsFiles } = require('../../tables');

module.exports = async function unlinkFiles(files, asset, { transacting } = {}) {
  const query = {
    file_$in: Array.isArray(files) ? files : [files],
  };

  if (asset) {
    query.asset = asset;
  }

  const deleted = await assetsFiles.deleteMany(query, { transacting });

  return deleted.count > 0;
};
