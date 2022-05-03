const getAssignablePermissionName = require('../../../assignable/permissions/assignable/getPermissionName');

module.exports = function getPermissionName(
  assignableInstance,
  { assignable, prefix = false } = {}
) {
  let name = `assignableInstance.${assignableInstance}`;
  if (assignable) {
    name = `${getAssignablePermissionName(assignable)}.${name}`;
  }

  return prefix ? leemons.plugin.prefixPN(name) : name;
};
