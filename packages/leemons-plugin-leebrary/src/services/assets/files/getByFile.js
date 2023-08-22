const { compact, uniq } = require('lodash');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { find: findAssets } = require('../find');
const { find: findBookmarks } = require('../../bookmarks/find');
const { tables } = require('../../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches the assets and bookmarks related to a file.
 * @param {string} fileId - The ID of the file.
 * @param {object} options - The options object.
 * @param {boolean} options.checkPermissions - Whether to check permissions.
 * @param {boolean} options.onlyPublic - Whether to only return public assets.
 * @param {object} options.userSession - The user session object.
 * @param {object} options.transacting - The transaction object.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of assets and bookmarks.
 */
async function fetchRelatedItems(fileId, { transacting }) {
  const promises = [
    tables.assetsFiles.find({ file: fileId }, { transacting }),
    findAssets({ cover: fileId }, { transacting }),
    findBookmarks({ icon: fileId }, { transacting }),
  ];

  return Promise.all(promises);
}

/**
 * Extracts the asset IDs from the related items.
 * @param {Array} relatedItems - The related items.
 * @returns {Array} - Returns an array of asset IDs.
 */
function extractAssetIds(relatedItems) {
  return compact(
    uniq(
      relatedItems[0]
        .map((item) => item.asset)
        .concat(relatedItems[1].map((item) => item.id))
        .concat(relatedItems[2].map((item) => item.asset))
    )
  );
}

/**
 * Checks if the asset is public.
 * @param {string} assetId - The ID of the asset.
 * @param {object} options - The options object.
 * @param {object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the asset is public.
 */
async function checkIfPublic(assetId, { transacting }) {
  const [asset] = await findAssets({ id: assetId }, { transacting });
  return asset?.public;
}

/**
 * Checks if the user has permissions to view the asset.
 * @param {string} assetId - The ID of the asset.
 * @param {object} options - The options object.
 * @param {object} options.userSession - The user session object.
 * @param {object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the user has permissions.
 */
async function checkUserPermissions(assetId, { userSession, transacting }) {
  const { permissions } = await getPermissions(assetId, { userSession, transacting });
  return permissions.view;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetches the asset related to a file by its ID.
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
    const relatedItems = await fetchRelatedItems(fileId, { transacting });
    const assetsIds = extractAssetIds(relatedItems);
    const assetId = assetsIds[0];

    const isPublic = await checkIfPublic(assetId, { transacting });
    if (onlyPublic && !isPublic) {
      return null;
    }

    const hasPermissions = await checkUserPermissions(assetId, { userSession, transacting });
    if (checkPermissions && !hasPermissions) {
      return null;
    }

    return assetId;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get files: ${e.message}`);
  }
}

module.exports = { getByFile };
