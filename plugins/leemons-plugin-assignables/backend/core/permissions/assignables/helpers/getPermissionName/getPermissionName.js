const { LeemonsError } = require('@leemons/error');

function getPermissionName({ id, prefix = false, ctx }) {
  if (!id) {
    throw new LeemonsError(ctx, { message: 'The assignable id is required' });
  }

  const name = `assignable.${id}`;

  return prefix ? ctx.prefixPN(name) : name;
}

module.exports = { getPermissionName };
