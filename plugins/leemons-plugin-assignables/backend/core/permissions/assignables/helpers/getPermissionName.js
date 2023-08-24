function getPermissionName({ id, prefix = false, ctx }) {
  if (!id) {
    throw new Error('The assignable id is required');
  }

  const name = `assignable.${id}`;

  return prefix ? ctx.prefixPN(name) : name;
}

module.exports = { getPermissionName };
