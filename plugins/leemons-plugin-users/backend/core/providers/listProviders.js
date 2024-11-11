const { LeemonsError } = require('@leemons/error');
const { getPluginProviders } = require('@leemons/providers');

const { isSuperAdmin } = require('../users');

async function listProviders({ ctx }) {
  const isSuper = await isSuperAdmin({ userId: ctx?.meta?.userSession?.id, ctx });

  if (!isSuper) {
    throw new LeemonsError(ctx, {
      message: 'Only the super admin can call this endpoint',
      httpStatusCode: 403,
      customCode: 'ONLY_SUPER_ADMIN',
    });
  }

  return await getPluginProviders({ keyValueModel: ctx.tx.db.KeyValue, raw: true });
}

module.exports = { listProviders };
