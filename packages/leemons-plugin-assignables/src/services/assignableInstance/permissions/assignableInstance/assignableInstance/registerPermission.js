const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');
const getPermissionType = require('../getPermissionType');

module.exports = async function registerPermission(assignableInstance, { transacting } = {}) {
  try {
    return await permission.addItem(
      assignableInstance,
      getPermissionType(),
      {
        permissionName: getPermissionName(assignableInstance),
        actionNames: leemons.plugin.config.constants.assignableInstanceActions,
      },
      { isCustomPermission: true, transacting }
    );
  } catch (e) {
    throw new Error(`Error registering permission: ${e.message}`);
  }
};
