const { last } = require('lodash');
const { permissionSeparator } = require('../../../../config/constants');

function getAssetIdFromPermissionName(permissionName) {
  return last(permissionName.split(permissionSeparator));
}

module.exports = getAssetIdFromPermissionName;
