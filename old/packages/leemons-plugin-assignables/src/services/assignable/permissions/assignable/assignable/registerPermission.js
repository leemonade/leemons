const getPermissionName = require('../getPermissionName');
const getPermissionType = require('../getPermissionType');
const permission = require('../../permission');

module.exports = async function registerPermission(assignable, { transacting }) {
  try {
    return await permission.addItem(
      assignable.id,
      getPermissionType(assignable.role),
      {
        permissionName: getPermissionName(assignable.id, { prefix: true }),
        actionNames: leemons.plugin.config.constants.assignableActions,
      },
      { isCustomPermission: true, transacting }
    );
  } catch (e) {
    e.message = `Error registering permission: ${e.message}`;
    throw e;
  }
};
