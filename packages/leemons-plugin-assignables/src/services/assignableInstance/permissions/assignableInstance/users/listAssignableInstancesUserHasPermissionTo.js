const permission = require('../../permission');
const getPermissionType = require('../getPermissionType');

module.exports = async function listAssignableInstancesUserHasPermissionTo({
  userSession,
  transacting,
} = {}) {
  const items = await permission.getAllItemsForTheUserAgentHasPermissionsByType(
    userSession.userAgents.map((u) => u.id),
    getPermissionType(),
    { transacting }
  );

  return items;
};
