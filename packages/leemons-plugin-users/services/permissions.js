const permissions = require('../src/services/permissions');
const itemPermissions = require('../src/services/item-permissions');
const userProfile = require('../src/services/user-profile');

module.exports = {
  add: permissions.add,
  addMany: permissions.addMany,
  update: permissions.update,
  updateMany: permissions.updateMany,
  delete: permissions.remove,
  deleteMany: permissions.removeMany,
  exist: permissions.exist,
  existMany: permissions.existMany,
  hasAction: permissions.hasAction,
  hasActionMany: permissions.hasActionMany,
  manyPermissionsHasManyActions: permissions.manyPermissionsHasManyActions,
  addActionMany: permissions.addActionMany,
  addAction: permissions.addAction,
  // User agent
  addCustomPermissionToUserAgent: permissions.addCustomPermissionToUserAgent,
  getUserAgentPermissions: permissions.getUserAgentPermissions,
  userAgentHasCustomPermission: permissions.userAgentHasCustomPermission,
  // Item permissions
  addItem: itemPermissions.add,
  addItemBasicIfNeed: itemPermissions.addBasicIfNeed,
  countItems: itemPermissions.count,
  findItems: itemPermissions.find,
  removeItems: itemPermissions.remove,
  existItems: itemPermissions.exist,
  // User profile
  addCustomPermissionToUserProfile: userProfile.addCustomPermissionToUserProfile,
  removeCustomPermissionToUserProfile: userProfile.removeCustomPermissionToUserProfile,
};
