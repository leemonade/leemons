const { permissionSeparator } = require('../../../config/constants');

function getAssetPermissionName({ assetId, ctx }) {
  return ctx.prefixPN(permissionSeparator + assetId);
}

module.exports = getAssetPermissionName;
