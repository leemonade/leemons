const { unlink: unlinkFiles } = require('../../assets/files/unlink');
const { normalizeItemsArray } = require('../../shared');
const { deleteFile } = require('./deleteFile');

/**
 * Remove files from the system
 *
 * @param {Object} params - The params object
 * @param {Array|string} params.fileIds - The ids of the files to be removed
 * @param {string} params.assetId - The id of the asset
 * @param {boolean} params.soft - Whether to soft delete the files
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<number>} - Returns the number of files successfully removed
 */
async function remove({ fileIds, assetId, soft, ctx }) {
  const files = await ctx.tx.db.Files.find({ id: normalizeItemsArray(fileIds) }).lean();

  // EN: Unlink the file from the asset
  // ES: Desvincular el archivo del asset
  await unlinkFiles({
    fileIds: files.map((file) => file.id),
    assetId,
    soft,
    ctx,
  });

  const deleted = await Promise.all(files.map((file) => deleteFile({ file, assetId, soft, ctx })));
  return deleted.reduce((acc, curr) => acc + (curr === true), 0);
}

module.exports = { remove };
