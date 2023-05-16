const { isArray, uniq } = require('lodash');
const { getByAssets: getFilesByAssets } = require('../assets/files/getByAssets');
const { getByIds } = require('./getByIds');

async function getTypesByAssets(assetIds, { transacting }) {
  const ids = isArray(assetIds) ? assetIds : [assetIds];
  const assetFiles = await getFilesByAssets(ids, { transacting });
  const fileTypes = await getByIds(
    assetFiles.map((item) => item.file),
    { columns: ['type'], transacting }
  );
  return uniq(fileTypes.map(({ type }) => type));
}
module.exports = { getTypesByAssets };
