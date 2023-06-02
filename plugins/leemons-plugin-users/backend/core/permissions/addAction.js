const { table } = require('../tables');

/**
 * Create multiple permissions
 * @public
 * @static
 * @param {string} permissionName - Permission to add action
 * @param {string} actionName - Action to add
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addAction(permissionName, actionName, { transacting }) {
  const values = await Promise.all([
    leemons.plugin.services.actions.exist(actionName, { transacting }),
    leemons.plugin.services.permissions.exist(permissionName, { transacting }),
    leemons.plugin.services.permissions.hasAction(permissionName, actionName, {
      transacting,
    }),
  ]);
  if (!values[0]) throw new Error(`There is no '${actionName}' action`);
  if (!values[1]) throw new Error(`There is no '${permissionName}' permission`);
  if (values[2])
    throw new Error(
      `Already exist the permission '${permissionName}' with the action '${actionName}'`
    );

  leemons.log.info(`Adding action '${actionName}' for permission '${permissionName}'`);
  return table.permissionAction.create({ permissionName, actionName }, { transacting });
}

module.exports = { addAction };
