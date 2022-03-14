const { tables } = require('../../tables');

module.exports = async function getByAsset(assetId, { transacting } = {}) {
  try {
    const tags = await tables.assetTags.find({ asset: assetId }, { transacting });
    return tags.map(({ tag }) => tag);
  } catch (e) {
    throw new Error(`Failed to get tags: ${e.message}`);
  }
};
