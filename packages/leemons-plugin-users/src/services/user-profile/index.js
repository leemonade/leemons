const {
  markAllUserAgentsForUserProfileToReloadPermissions,
} = require('./markAllUserAgentsForUserProfileToReloadPermissions');
const { removeCustomPermissionToUserProfile } = require('./removeCustomPermissionToUserProfile');
const { addCustomPermissionToUserProfile } = require('./addCustomPermissionToUserProfile');
const { getRole } = require('./getRole');
const { exist } = require('./exist');
const { add } = require('./add');

module.exports = {
  markAllUserAgentsForUserProfileToReloadPermissions,
  removeCustomPermissionToUserProfile,
  addCustomPermissionToUserProfile,
  getRole,
  exist,
  add,
};
