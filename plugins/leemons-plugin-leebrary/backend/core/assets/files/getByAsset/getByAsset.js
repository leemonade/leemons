const { LeemonsError } = require('@leemons/error');
const { handleUserPermissions } = require('./handleUserPermissions');
/**
 * Get the files associated with an asset if the user has view permissions
 *
 * @param {string} assetId - The ID of the asset to check
 * @param {boolean} options.checkPermissions - Flag to check permissions
 * @param {MoleculerContext} ctx - The Moleculer context
 * @returns {Promise<Array|void>} - Returns an array of file Ids if the user has view permissions, void otherwise
 * @throws {LeemonsError} - Throws an error if the operation fails
 */

async function getByAsset({ assetId, checkPermissions = true, ctx }) {
  try {
    if (checkPermissions) {
      const hasPermissions = await handleUserPermissions({ assetId, ctx });
      if (!hasPermissions) {
        return [];
      }
    }

    return ctx.tx.db.AssetsFiles.find({ asset: assetId }).then((files) =>
      files.map((file) => file.file)
    );
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get files: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByAsset };
