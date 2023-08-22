const { getByAsset } = require('./getByAsset');

/**
 * Fetches the permissions for a given asset and checks if all the provided permissions are included.
 * 
 * @param {string} assetId - The ID of the asset
 * @param {Array} permissions - An array of permissions to check
 * @param {Object} options - An object containing userSession and transacting properties
 * @returns {Promise<boolean>} - Returns true if all permissions are included, false otherwise
 * @throws {HttpError} - Throws an error if there's a failure in getting permissions
 */
async function has(assetId, permissions, { userSession, transacting } = {}) {
  try {
    const current = Object.entries(await getByAsset(assetId, { userSession, transacting }))
      .filter(([, value]) => value)
      .map(([key]) => key);

    return permissions.every((p) => current.includes(p));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { has };
