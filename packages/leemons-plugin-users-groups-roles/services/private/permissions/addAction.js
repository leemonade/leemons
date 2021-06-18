const { table } = require('../tables');

/**
 * Create multiple permissions
 * @public
 * @static
 * @param {string} permissionName - Permission to add action
 * @param {string} actionName - Action to add
 * @return {Promise<any>}
 * */
async function addAction(permissionName, actionName) {
  const values = await Promise.all([
    leemons.plugin.services.actions.exist(actionName),
    leemons.plugin.services.permissions.exist(permissionName),
    leemons.plugin.services.permissions.existPermissionAction(permissionName, actionName),
  ]);
  if (!values[0]) throw new Error(`There is no ${actionName} action`);
  if (!values[1]) throw new Error(`There is no ${permissionName} permission`);
  if (!values[2])
    throw new Error(`Already exist the permission ${permissionName} with the action ${actionName}`);

  return table.permissionAction.create({ permissionName, actionName });
}

module.exports = { addAction };
