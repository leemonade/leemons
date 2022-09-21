const userAgents = require('../src/services/user-agents');
const permissions = require('../src/services/permissions');
const userProfile = require('../src/services/user-profile');
const itemPermissions = require('../src/services/item-permissions');
const userAgentsService = require('../src/services/user-agents');

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
  findUsersWithPermissions: permissions.findUsersWithPermissions,
  findUserAgentsWithPermission: permissions.findUserAgentsWithPermission,
  removeCustomPermissionForAllUserAgents: permissions.removeCustomPermissionForAllUserAgents,
  manyPermissionsHasManyActions: permissions.manyPermissionsHasManyActions,
  // User agent
  getUserAgentPermissions: userAgents.permissions.getUserAgentPermissions,
  userAgentHasPermission: userAgentsService.permissions.userAgentHasPermission,
  userAgentHasCustomPermission: userAgents.permissions.userAgentHasCustomPermission,
  addCustomPermissionToUserAgent: userAgents.permissions.addCustomPermissionToUserAgent,
  removeCustomUserAgentPermission: userAgentsService.permissions.removeCustomUserAgentPermission,

  // Item permissions
  addItem: itemPermissions.add,
  findItems: itemPermissions.find,
  existItems: itemPermissions.exist,
  countItems: itemPermissions.count,
  removeItems: itemPermissions.remove,
  addItemBasicIfNeed: itemPermissions.addBasicIfNeed,
  getItemPermissions: itemPermissions.getItemPermissions,
  getUserAgentsWithPermissionsForItem: itemPermissions.getUserAgentsWithPermissionsForItem,
  // User profile
  addCustomPermissionToUserProfile: userProfile.addCustomPermissionToUserProfile,
  removeCustomPermissionToUserProfile: userProfile.removeCustomPermissionToUserProfile,

  // User agent - Item permissions
  userAgentHasPermissionToItem: userAgents.itemPermissions.userAgentHasPermissionToItem,
  getAllItemsForTheUserAgentHasPermissions:
    userAgents.itemPermissions.getAllItemsForTheUserAgentHasPermissions,
  getAllItemsForTheUserAgentHasPermissionsByType:
    userAgents.itemPermissions.getAllItemsForTheUserAgentHasPermissionsByType,
};
