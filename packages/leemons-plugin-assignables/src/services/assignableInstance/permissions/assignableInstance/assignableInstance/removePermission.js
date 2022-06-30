const permission = require('../../permission');
const getPermissionName = require('../getPermissionName');
const getPermissionType = require('../getPermissionType');

module.exports = async function removePermission(asignableInstance, assignable, { transacting }) {
  try {
    return await permission.removeItems(
      {
        type: getPermissionType(),
        permissionName: getPermissionName(asignableInstance, { assignable, prefix: true }),
      },
      { transacting }
    );
  } catch (e) {
    throw new Error(`Error removing permission: ${e.message}`);
  }
};
