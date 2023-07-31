const { permissionSeparator } = require('../../../../config/constants');

function getAssetPermissionName(assetId) {
  return leemons.plugin.prefixPN(permissionSeparator + assetId);
}

module.exports = getAssetPermissionName;
