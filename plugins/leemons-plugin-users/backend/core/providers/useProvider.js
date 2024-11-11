const { LeemonsError } = require('@leemons/error');
const { getPluginProvider } = require('@leemons/providers');

const { isSuperAdmin } = require('../users');

/**
 * @param {object} props
 * @param {string} props.provider
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function useProvider({ provider, ctx }) {
  try {
    const isSuper = await isSuperAdmin({ userId: ctx?.meta?.userSession?.id, ctx });
    if (!isSuper) {
      throw new LeemonsError(ctx, {
        message: 'Only the super admin can call this endpoint',
        httpStatusCode: 403,
        customCode: 'ONLY_SUPER_ADMIN',
      });
    }

    const providerEntry = await getPluginProvider({
      providerName: provider,
      keyValueModel: ctx.tx.db.KeyValue,
    });

    if (!providerEntry) {
      throw new LeemonsError(ctx, {
        message: 'Provider is required',
        httpStatusCode: 400,
        customCode: 'PROVIDER_REQUIRED',
      });
    }

    await ctx.tx.db.LoginProvider.findOneAndUpdate(
      {
        deploymentID: ctx.deploymentID,
      },
      {
        name: provider,
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (providerEntry.value.params.supportedMethods.initialization) {
      await ctx.tx.call(providerEntry.value.params.supportedMethods.initialization.action);
    }

    return true;
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: 'Error using provider',
      httpStatusCode: 500,
      customCode: 'USE_PROVIDER_ERROR',
      cause: error,
    });
  }
}

module.exports = { useProvider };
