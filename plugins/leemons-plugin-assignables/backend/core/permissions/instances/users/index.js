const { addPermissionToUser } = require('./addPermissionToUser');
const { getTeacherPermission } = require('./getTeacherPermission');
const { getTeacherPermissions } = require('./getTeacherPermissions');
const { getUserPermission } = require('./getUserPermission');
const { getUserPermissionMultiple } = require('./getUserPermissionMultiple');
const { getUserPermissions } = require('./getUserPermissions');
const {
  listAssignableInstancesUserHasPermissionTo,
} = require('./listAssignableInstancesUserHasPermissionTo');

module.exports = {
  addPermissionToUser,
  getTeacherPermission,
  getTeacherPermissions,
  getUserPermission,
  getUserPermissionMultiple,
  getUserPermissions,
  listAssignableInstancesUserHasPermissionTo,
};
