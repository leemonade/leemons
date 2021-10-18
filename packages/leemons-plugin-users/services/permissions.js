const permissions = require('../src/services/permissions');
const userProfile = require('../src/services/user-profile');
const itemPermissions = require('../src/services/item-permissions');

module.exports = {
  add: permissions.add,
  exist: permissions.exist,
  delete: permissions.remove,
  update: permissions.update,
  addMany: permissions.addMany,
  existMany: permissions.existMany,
  hasAction: permissions.hasAction,
  addAction: permissions.addAction,
  updateMany: permissions.updateMany,
  deleteMany: permissions.removeMany,
  hasActionMany: permissions.hasActionMany,
  addActionMany: permissions.addActionMany,
  findUserAgentsWithPermission: permissions.findUserAgentsWithPermission,
  manyPermissionsHasManyActions: permissions.manyPermissionsHasManyActions,

  // User agent
  getUserAgentPermissions: permissions.getUserAgentPermissions,
  userAgentHasCustomPermission: permissions.userAgentHasCustomPermission,
  addCustomPermissionToUserAgent: permissions.addCustomPermissionToUserAgent,

  // Item permissions
  addItem: itemPermissions.add,
  findItems: itemPermissions.find,
  existItems: itemPermissions.exist,
  countItems: itemPermissions.count,
  removeItems: itemPermissions.remove,
  addItemBasicIfNeed: itemPermissions.addBasicIfNeed,

  // User profile
  addCustomPermissionToUserProfile: userProfile.addCustomPermissionToUserProfile,
  removeCustomPermissionToUserProfile: userProfile.removeCustomPermissionToUserProfile,
};
