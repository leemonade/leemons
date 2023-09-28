const { LeemonsError } = require('@leemons/error');
const { remove } = require('../remove');
const { handleUserPermissions } = require('./handleUserPermissions');

/**
 * Unlinks files from an asset.
 * This function checks if the user has permissions to delete the asset, and if so, it removes the files from the asset.
 *
 * @param {Array|string} fileIds - The IDs of the files to be unlinked.
 * @param {string} assetId - The ID of the asset from which files are to be unlinked.
 * @param {Object} options - The options object.
 * @param {boolean} [options.soft] - Whether to perform a soft delete. Defaults to false.
 * @param {MoleculerContext} options.ctx - The moleculer context.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the files were successfully unlinked from the asset.
 */
async function unlink({ fileIds, assetId, soft, ctx }) {
  try {
    const hasPermissions = await handleUserPermissions({ assetId, ctx });
    if (!hasPermissions) {
      throw new LeemonsError(ctx, {
        message: "You don't have permissions to delete this asset",
        httpStatusCode: 401,
      });
    }
    return remove({ fileIds, assetId, soft, ctx });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to delete file: ${e.message}`,
      httpStatusCode:
        e instanceof LeemonsError && Number.isInteger(e.httpStatusCode) ? e.httpStatusCode : 500,
    });
  }
}

module.exports = { unlink };
