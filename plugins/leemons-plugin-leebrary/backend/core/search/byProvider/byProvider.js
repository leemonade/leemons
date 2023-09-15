const { LeemonsError } = require('@leemons/error');

const { getByIds: getAssetsByIds } = require('../../assets/getByIds');
const { getById: getCategoryById } = require('../../categories/getById');
const { getByName: getProviderByName } = require('../../providers/getByName');

async function byProvider({
  categoryId,
  criteria,
  query,
  details = false,
  assets: assetsIds,
  category,
  published,
  preferCurrent,
  ctx,
}) {
  if (!category && categoryId) {
    // eslint-disable-next-line no-param-reassign
    category = await getCategoryById({ id: categoryId, ctx });
  }

  if (!category) {
    throw new LeemonsError(ctx, { message: 'Category is required', httpStatusCode: 400 });
  }

  try {
    //    const provider = leemons.getProvider(category.provider) || leemons.getPlugin(category.provider);
    // * Esta linea busca el proveedor por su nombre 'category.provider'
    // * si no lo encuentra la busca como plugin (entiendo que es para cuando category.provider === 'leebrary')

    //! Ahora buscaría el provider así
    const provider = await getProviderByName({ name: category.provider, ctx });

    // if (typeof provider?.services?.assets?.search !== 'function') {
    //   return null;
    // }
    // * En esta linea veo si existe la función assets.search
    // * en el caso de que sea leebrary esa función no existe... así que no hace nada (devuelve null)

    //! si el método no existe o no existe el provider se sale devolviendo null
    //! si category.provider === 'leemons' no va a existir provider, por lo que también se sale devolviendo null
    if (!provider?.supportedMethods?.search) {
      return null;
    }

    // * Se hacía la búsqueda en el servicio del provider
    // const assets = await provider.services.assets.search(criteria, {
    //   query,
    //   category,
    //   assets: assetsIds,
    //   published,
    //   preferCurrent,
    //   userSession,
    //   transacting,
    // });

    //! Ahora lo haríamos igual pero usando el ctx.tx.call
    const assets = await ctx.tx.call(`${category.provider}.assets.search`, {
      criteria,
      query,
      category,
      assets: assetsIds,
      published,
      preferCurrent,
    });

    if (details) {
      return getAssetsByIds({ ids: assets, ctx });
    }

    return assets;
  } catch (e) {
    ctx.logger.error(e);
    throw new LeemonsError(ctx, {
      message: `Failed to find asset in provider: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { byProvider };
