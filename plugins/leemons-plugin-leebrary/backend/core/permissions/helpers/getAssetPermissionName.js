const { permissionSeparator } = require('../../../config/constants');

/**
 * Generates the permission name for a given asset.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.assetId - The ID of the asset for which to generate the permission name.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {string} - The generated permission name.
 */
function getAssetPermissionName({ assetId, ctx }) {
  return ctx.prefixPN(permissionSeparator + assetId);
}

module.exports = getAssetPermissionName;
