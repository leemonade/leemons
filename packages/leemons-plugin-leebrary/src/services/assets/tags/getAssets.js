const { groupBy } = require('lodash');
const { tables } = require('../../tables');
const { getByIds: getAssetsByIds } = require('../getByIds');

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

    let assets = await tables.assetTags.find(query, { transacting });
    assets = Object.entries(groupBy(assets, 'asset'))
      .filter(([, t]) => t.length === _tags.length)
      .map(([asset]) => asset);

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }

    return assets;
  } catch (e) {
    throw new global.utils.HttpError(422, `Failed to get assets with the given tags: ${e.message}`);
  }
};
