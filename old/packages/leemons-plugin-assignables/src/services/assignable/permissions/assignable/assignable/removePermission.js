const getPermissionName = require('../getPermissionName');
const getPermissionType = require('../getPermissionType');
const permission = require('../../permission');

module.exports = async function removePermission(assignable, { transacting }) {
  try {
    await permission.removeItems(
      {
        type: getPermissionType(assignable),
        permissionName: getPermissionName(assignable),
      },
      { transacting }
    );
  } catch (e) {
    throw new Error(`Error removing permission: ${e.message}`);
  }
};
