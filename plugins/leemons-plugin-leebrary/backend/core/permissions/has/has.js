const { LeemonsError } = require('@leemons/error');
const { getByAsset } = require('../getByAsset');

/**
 * Checks if the asset has the specified permissions.
 * @param {Object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Array<string>} params.permissions - The permissions to check.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<boolean>} Returns true if the asset has all the specified permissions, false otherwise.
 * @throws {LeemonsError} If there was an error getting the permissions.
 */
async function has({ assetId, permissions, ctx }) {
  try {
    const current = Object.entries(await getByAsset({ assetId, ctx }))
      .filter(([, value]) => value)
      .map(([key]) => key);

    return permissions.every((p) => current.includes(p));
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get permissions: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { has };
