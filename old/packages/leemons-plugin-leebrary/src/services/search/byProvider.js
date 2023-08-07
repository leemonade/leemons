const { getByIds: getAssetsByIds } = require('../assets/getByIds');
const { getById: getCategoryById } = require('../categories/getById');

async function byProvider(
  categoryId,
  criteria,
  {
    query,
    details = false,
    assets: assetsIds,
    category,
    published,
    preferCurrent,
    userSession,
    transacting,
  } = {}
) {
  if (!category && categoryId) {
    // eslint-disable-next-line no-param-reassign
    category = await getCategoryById(categoryId, { transacting });
  }

  if (!category) {
    throw new global.utils.HttpError(400, 'Category is required');
  }

  try {
    const provider = leemons.getProvider(category.provider) || leemons.getPlugin(category.provider);

    if (typeof provider?.services?.assets?.search !== 'function') {
      return null;
    }

    const assets = await provider.services.assets.search(criteria, {
      query,
      category,
      assets: assetsIds,
      published,
      preferCurrent,
      userSession,
      transacting,
    });

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }

    return assets;
  } catch (e) {
    console.error(e);
    throw new global.utils.HttpError(500, `Failed to find asset in provider: ${e.message}`);
  }
}

module.exports = { byProvider };
