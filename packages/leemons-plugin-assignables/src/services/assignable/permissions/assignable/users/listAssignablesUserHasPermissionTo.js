const permission = require('../../permission');
const getPermissionType = require('../getPermissionType');

module.exports = async function listAssignablesUserHasPermissionTo(
  role,
  { userSession, transacting } = {}
) {
  const items = await permission.getAllItemsForTheUserAgentHasPermissionsByType(
    userSession.userAgents.map((u) => u.id),
    getPermissionType({ role }),
    { transacting }
  );

  return items;
};
