const { assets: table } = require('../tables');

module.exports = async function assetExists(asset, { transacting } = {}) {
  const _asset = await table.count({ id: asset }, { transacting });

  return _asset > 0;
};
