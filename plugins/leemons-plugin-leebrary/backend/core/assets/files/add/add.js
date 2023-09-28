const { LeemonsError } = require('@leemons/error');
const { handlePermissions } = require('./handlePermissions');
const { handleExistence } = require('./handleExistence');

/**
 * Add a file to an asset
 *
 * @param {string} fileId - The ID of the file to add
 * @param {string} assetId - The ID of the asset to add the file to
 * @param {object} options - The options object
 * @param {boolean} options.skipPermissions - Flag to skip permission check
 * @param {MoleculerContext} ctx - The moleculer context
 * @returns {Promise<object>} - Returns the updated asset
 */
async function add({ fileId, assetId, skipPermissions, ctx }) {
  try {
    await handlePermissions({ assetId, skipPermissions, ctx });
    await handleExistence({ fileId, assetId, ctx });

    return ctx.tx.db.AssetsFiles.findOneAndUpdate(
      { asset: assetId, file: fileId },
      { asset: assetId, file: fileId },
      { upsert: true, lean: true, new: true }
    );
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to add file: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { add };
