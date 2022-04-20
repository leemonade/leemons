const getPermissionName = require('../getPermissionName');
const getPermissionType = require('../getPermissionType');
const permission = require('../../permission');

module.exports = async function registerPermission(assignable, { transacting }) {
  try {
    await permission.addItem(
      assignable.id,
      getPermissionType(assignable),
      {
        permissionName: getPermissionName(assignable),
        actionNames: leemons.plugin.config.constants.assignableRoles,
      },
      { isCustomPermission: true, transacting }
    );
  } catch (e) {
    throw new Error(`Error registering permission: ${e.message}`);
  }
};
