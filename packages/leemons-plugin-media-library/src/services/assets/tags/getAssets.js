const groupBy = require('lodash.groupby');
const { assetTags } = require('../../tables');

module.exports = async function getAssets(tags, { assets: limitTo, transacting } = {}) {
  const _tags = [...new Set(Array.isArray(tags) ? tags : [tags])];

  try {
    const query = {
      tag_$in: _tags,
    };

    if (limitTo) {
      query.asset_$in = limitTo;
    }

    const assets = await assetTags.find(query, { transacting });
    return Object.entries(groupBy(assets, 'asset'))
      .filter(([, t]) => t.length === _tags.length)
      .map(([asset]) => asset);
  } catch (e) {
    throw new Error(`Failed to get assets with the given tags: ${e.message}`);
  }
};
