const { isArray, uniq } = require('lodash');
const { getByAssets: getFilesByAssets } = require('../../assets/files/getByAssets');
const { getByIds } = require('../getByIds');

/**
 * Fetches file types by asset IDs.
 *
 * @param {Object} params - The params object.
 * @param {Array|string} params.assetIds - The asset IDs.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<Array>} The fetched file types.
 */
async function getTypesByAssets({ assetIds, ctx }) {
  const ids = isArray(assetIds) ? assetIds : [assetIds];
  const assetFiles = await getFilesByAssets({ assetIds: ids, ctx });
  const fileIds = assetFiles.map((item) => item.file);
  const fileTypes = await getByIds({ fileIds, columns: ['type'], ctx });

  return uniq(fileTypes.map(({ type }) => type));
}
module.exports = { getTypesByAssets };
