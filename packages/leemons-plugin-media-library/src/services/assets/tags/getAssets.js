const groupBy = require('lodash.groupby');
const { assetTags } = require('../../tables');
const assetsDetails = require('../details');

module.exports = async function getAssets(
  tags,
  { details = false, assets: limitTo, transacting } = {}
) {
  const _tags = [...new Set(Array.isArray(tags) ? tags : [tags])];

  try {
    const query = {
      tag_$in: _tags,
    };

    if (limitTo) {
      query.asset_$in = limitTo;
    }

    let assets = await assetTags.find(query, { transacting });
    assets = Object.entries(groupBy(assets, 'asset'))
      .filter(([, t]) => t.length === _tags.length)
      .map(([asset]) => asset);

    if (details) {
      return assetsDetails(assets, { transacting });
    }

    return assets;
  } catch (e) {
    throw new Error(`Failed to get assets with the given tags: ${e.message}`);
  }
};
