const {
  markAllUserAgentsForUserProfileToReloadPermissions,
} = require('./permissions/markAllUserAgentsForUserProfileToReloadPermissions');
const {
  removeCustomPermissionToUserProfile,
} = require('./permissions/removeCustomPermissionToUserProfile');
const {
  addCustomPermissionToUserProfile,
} = require('./permissions/addCustomPermissionToUserProfile');
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
