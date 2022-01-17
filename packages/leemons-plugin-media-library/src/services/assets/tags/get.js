const { assetTags } = require('../../tables');

module.exports = async function get(asset, { transacting } = {}) {
  try {
    const tags = await assetTags.find({ asset }, { transacting });
    return tags.map(({ tag }) => tag);
  } catch (e) {
    throw new Error(`Failed to get tags: ${e.message}`);
  }
};
