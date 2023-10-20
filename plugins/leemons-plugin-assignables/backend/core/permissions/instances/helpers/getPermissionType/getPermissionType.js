function getPermissionType({ ctx }) {
  return ctx.prefixPN(`assignableInstance`);
}

module.exports = { getPermissionType };
