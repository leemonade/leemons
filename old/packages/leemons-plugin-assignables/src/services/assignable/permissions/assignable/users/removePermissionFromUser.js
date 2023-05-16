const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');
const getUserPermission = require('./getUserPermission');

module.exports = async function removePermissionFromUser(
  assignable,
  userAgent,
  { transacting } = {}
) {
  const { actions } = await getUserPermission(assignable, {
    userSession: { userAgents: [userAgent] },
    transacting,
  });

  await permission.removeCustomUserAgentPermission(
    userAgent.id,
    {
      permissionName: getPermissionName(assignable.id, { prefix: true }),
      actionNames: actions,
    },
    { transacting }
  );

  return {
    userAgent,
    actions,
  };
};
