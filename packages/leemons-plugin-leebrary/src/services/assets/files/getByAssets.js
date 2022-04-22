const { isArray } = require('lodash');
const { tables } = require('../../tables');

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
