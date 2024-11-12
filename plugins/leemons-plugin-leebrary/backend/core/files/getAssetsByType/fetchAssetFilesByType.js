const { getByFiles: getAssetsByFiles } = require('../../assets/files/getByFiles');
const { getByType } = require('../getByType/getByType');
/**
 * Fetches the asset files by type.
 *
 * @param {Object} params - The params object.
 * @param {string|array} params.type - The file type or list of file types to filter by
 * @param {Array} params.fileIds - The file IDs.
 * @param {MoleculerContext} params.ctx - The Moleculer context object.
 * @returns {Promise<Array>} The asset files.
 */
async function fetchAssetFilesByType({ type, fileIds, ctx }) {
  const files = await getByType({ type, files: fileIds, ctx });

  return getAssetsByFiles({
    fileIds: files.map(({ id }) => id),
    ctx,
  });
}
module.exports = { fetchAssetFilesByType };
