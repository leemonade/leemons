const { table } = require('../tables');
const constants = require('../../../config/constants');

/**
 * Check if the permission has action
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {string} actionName - Action name
 *  @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function hasAction(permissionName, actionName, { transacting }) {
  if (
    constants.basicPermission.permissionName === permissionName &&
    constants.basicPermission.actionName === actionName
  )
    return true;
  const response = await table.permissionAction.count(
    {
      permissionName,
      actionName,
    },
    { transacting }
  );
  return !!response;
}

module.exports = { hasAction };
