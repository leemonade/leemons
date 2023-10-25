function getPermissionType({ role, ctx }) {
  if (!role) {
    throw new Error('The role is required');
  }
  return ctx.prefixPN(`assignable.${role}`);
}

module.exports = { getPermissionType };
