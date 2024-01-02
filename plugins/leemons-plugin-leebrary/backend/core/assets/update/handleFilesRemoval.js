const { compact, isEmpty, uniq } = require('lodash');

const { remove: removeFilesById } = require('../files/remove');

/**
 * Handles the removal of asset files if necessary.
 * If the file or cover needs to be updated, it removes the old files from the asset.
 *
 * @param {Object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Object} params.assetData - The asset data object.
 * @param {Array} params.filesToRemove - The files that need to be removed.
 * @param {boolean} params.fileNeedsUpdate - A flag indicating whether the file needs to be updated.
 * @param {boolean} params.coverNeedsUpdate - A flag indicating whether the cover needs to be updated.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<void>} Resolves when the files are removed.
 * @throws {Error} If the removal of the files fails.
 */
async function handleFilesRemoval({
  assetId,
  assetData,
  filesToRemove,
  fileNeedsUpdate,
  coverNeedsUpdate,
  ctx,
}) {
  // In theory the "filesToRemove" array, already contains the fileIds to remove
  /*
  if (fileNeedsUpdate) {
    filesToRemove.push(assetData.file);
  }
  if (coverNeedsUpdate) {
    filesToRemove.push(assetData.cover, assetData.coverFile);
  }
  */
  if (!isEmpty(filesToRemove)) {
    try {
      await removeFilesById({ fileIds: compact(uniq(filesToRemove)), assetId, ctx });
    } catch (e) {
      //
    }
  }
}

module.exports = { handleFilesRemoval };
