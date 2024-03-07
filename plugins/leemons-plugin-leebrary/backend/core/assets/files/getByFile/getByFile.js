const { last } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getRelatedAssets } = require('./getRelatedAssets');
const { handleIsPublic } = require('./handleIsPublic');
const { handleUserPermissions } = require('./handleUserPermissions');

/**
 * Fetches the asset related to a file by its ID.
 *
 * @param {object} params - The params object.
 * @param {string} params.fileId - The ID of the file.
 * @param {boolean} params.checkPermissions - Flag to check permissions. Defaults to true.
 * @param {boolean} params.onlyPublic - Flag to only return public assets.
 * @param {MoleculerContext} params.ctx - The Moleculer context
 * @returns {Promise<string|null>} - Returns a promise that resolves to the asset ID if the asset is public and the user has permissions to view it, otherwise null.
 * @throws {LeemonsError} - Throws a Leemons error with a 500 HTTP code when the operation fails.
 */
async function getByFile({ fileId, checkPermissions = true, onlyPublic, ctx }) {
  try {
    const assetsIds = await getRelatedAssets({ fileId, ctx });
    const assetId = last(assetsIds);

    if (onlyPublic) {
      const isPublic = await handleIsPublic({ assetId, ctx });
      if (!isPublic) {
        return null;
      }
    }

    if (checkPermissions) {
      const hasPermissions = await handleUserPermissions({ assetId, ctx });
      if (!hasPermissions) {
        return null;
      }
    }

    return assetId;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get files: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByFile };
