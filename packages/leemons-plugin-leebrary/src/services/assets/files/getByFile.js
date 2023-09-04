const { compact, uniq } = require('lodash');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { find: findAssets } = require('../find');
const { find: findBookmarks } = require('../../bookmarks/find');
const { tables } = require('../../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches the assets and bookmarks related to a file.
 * 
 * @param {object} params - The params object.
 * @param {string} params.fileId - The ID of the file.
 * @param {object} params.transacting - The transaction object.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of assets and bookmarks IDs.
 */
async function getRelatedAssets({ fileId, transacting }) {
  const promises = [
    // ES: Buscamos en las relaciones entre archivos y assets
    // EN: Search in the relations between files and assets
    tables.assetsFiles.find({ file: fileId }, { transacting }),
    // ES: Buscamos los assets que tengan el archivo como cover
    // EN: Search the assets that have the file as cover
    findAssets({ cover: fileId }, { transacting }),
    // ES: Buscamos los bookmarks que tengan el archivo como icon
    // EN: Search the bookmarks that have the file as icon
    findBookmarks({ icon: fileId }, { transacting }),
  ];

  const result = await Promise.all(promises);
  return compact(
    uniq(
      result[0].map((item) => item.asset)
        .concat(result[1].map((item) => item.id))
        .concat(result[2].map((item) => item.asset))
    )
  );
}

/**
 * Checks if the asset is public.
 * 
 * @param {object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {object} params.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the asset is public.
 */
async function checkIsPublic({ assetId, transacting }) {
  const [asset] = await findAssets({ id: assetId }, { transacting });
  return asset?.public;
}

/**
 * Checks if the user has permissions to view the asset.
 * 
 * @param {object} params - The options object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {object} params.userSession - The user session object.
 * @param {object} params.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the user has permissions.
 */
async function checkUserPermissions({ assetId, userSession, transacting }) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions(assetId, { userSession, transacting });

  // EN: Check if the user has permissions to view the asset
  // ES: Comprobar si el usuario tiene permisos para ver el asset
  return permissions.view;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetches the asset related to a file by its ID.
 * 
 * @param {string} fileId - The ID of the file.
 * @param {object} options - The options object.
 * @param {boolean} options.checkPermissions - Whether to check permissions. Default is true.
 * @param {boolean} options.onlyPublic - Whether to only return public assets.
 * @param {object} options.userSession - The user session object.
 * @param {object} options.transacting - The transaction object.
 * @returns {Promise<string|null>} - Returns a promise that resolves to the asset ID if the asset is public and the user has permissions to view it, otherwise null.
 * @throws {HttpError} - Throws an HTTP error if the operation fails.
 */
async function getByFile(
  fileId,
  { checkPermissions = true, onlyPublic, userSession, transacting } = {}
) {
  try {
    const assetsIds = await getRelatedAssets({ fileId, transacting });
    const assetId = assetsIds[0];

    if (onlyPublic) {
      const isPublic = await checkIsPublic({ assetId, transacting });
      if (!isPublic) {
        return null;
      }
    }

    if (checkPermissions) {
      const hasPermissions = await checkUserPermissions({ assetId, userSession, transacting });
      if (!hasPermissions) {
        return null;
      }
    }

    return assetId;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get files: ${e.message}`);
  }
}

module.exports = { getByFile };
