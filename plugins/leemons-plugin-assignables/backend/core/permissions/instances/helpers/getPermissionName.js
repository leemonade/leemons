const {
  getPermissionName: getAssignablePermissionName,
} = require('../../helpers/getPermissionName');

function getPermissionName({ assignableInstance, assignable, prefix = false, ctx }) {
  let name = `assignableInstance.${assignableInstance}`;
  if (assignable) {
    name = `${getAssignablePermissionName({ assignableId: assignable, ctx })}.${name}`;
  }

  return prefix ? ctx.prefixPN(name) : name;
}

module.exports = { getPermissionName };
