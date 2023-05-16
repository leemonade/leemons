const { isArray, uniq, isEmpty } = require('lodash');
const { getByAssets: getFilesByAssets } = require('../assets/files/getByAssets');
const { getByFiles: getAssetsByFiles } = require('../assets/files/getByFiles');
const { getByType } = require('./getByType');

async function getAssetsByType(type, { assets, transacting }) {
  let fileIds = [];
  let assetFiles = [];

  if (assets && !isEmpty(assets)) {
    const ids = isArray(assets) ? assets : [assets];
    assetFiles = await getFilesByAssets(ids, { transacting });
    fileIds = uniq(assetFiles.map((item) => item.file));
  }

  const files = await getByType(type, { files: fileIds, transacting });
  assetFiles = await getAssetsByFiles(
    files.map(({ id }) => id),
    { transacting }
  );

  return assetFiles.map(({ asset }) => asset);
}
module.exports = { getAssetsByType };
