const { tables } = require('../../tables');

module.exports = async function has(asset, tag, { transacting } = {}) {
  const count = await tables.assetTags.count({ asset, tag }, { transacting });
  return count > 0;
};
