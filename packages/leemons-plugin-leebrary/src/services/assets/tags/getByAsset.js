const { tables } = require('../../tables');

module.exports = async function getByAsset(assetId, { transacting } = {}) {
  try {
    const tags = await tables.assetTags.find({ asset: assetId }, { transacting });
    return tags.map(({ tag }) => tag);
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get tags: ${e.message}`);
  }
};
