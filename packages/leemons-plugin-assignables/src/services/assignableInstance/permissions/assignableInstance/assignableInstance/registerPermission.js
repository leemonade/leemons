const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');
const getPermissionType = require('../getPermissionType');

module.exports = async function registerPermission(
  assignableInstance,
  assignable,
  { transacting } = {}
) {
  try {
    return await permission.addItem(
      assignableInstance,
      getPermissionType(),
      {
        permissionName: getPermissionName(assignableInstance, { assignable, prefix: true }),
        actionNames: leemons.plugin.config.constants.assignableInstanceActions,
      },
      { isCustomPermission: true, transacting }
    );
  } catch (e) {
    throw new Error(`Error registering permission: ${e.message}`);
  }
};
