const { isArray } = require('lodash');

async function getByAssets(assetIds, { transacting } = {}) {
  const ids = isArray(assetIds) ? assetIds : [assetIds];
  return tables.assetsFiles.find(
    {
      asset_$in: ids,
    },
    { transacting }
  );
}

module.exports = { getByAssets };
