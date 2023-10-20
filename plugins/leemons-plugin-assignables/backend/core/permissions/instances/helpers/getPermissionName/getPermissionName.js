const {
  getPermissionName: getAssignablePermissionName,
} = require('../../../assignables/helpers/getPermissionName');

function getPermissionName({ assignableInstance, assignable, prefix = false, ctx }) {
  let name = `assignableInstance.${assignableInstance}`;
  if (assignable) {
    name = `${getAssignablePermissionName({ id: assignable, ctx })}.${name}`;
  }

  return prefix ? ctx.prefixPN(name) : name;
}

module.exports = { getPermissionName };
