const { LeemonsError } = require('@leemons/error');

async function checkSuperAdmin(ctx, { notThrow = false } = {}) {
  const isSuper = await ctx.tx.call('users.users.isSuperAdmin', {
    userId: ctx?.meta?.userSession?.id,
  });

  if (!isSuper) {
    if (notThrow) {
      return false;
    }

    throw new LeemonsError(ctx, {
      message: 'Only super admins can change the organization',
    });
  }

  return true;
}

module.exports = { checkSuperAdmin };
