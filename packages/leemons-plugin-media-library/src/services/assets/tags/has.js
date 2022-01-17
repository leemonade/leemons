const { assetTags } = require('../../tables');

module.exports = async function has(asset, tag, { transacting } = {}) {
  const count = await assetTags.count({ asset, tag }, { transacting });
  return count > 0;
};
