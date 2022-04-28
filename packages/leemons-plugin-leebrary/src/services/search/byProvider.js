const { getByIds: getAssetsByIds } = require('../assets/getByIds');
const { getById: getCategoryById } = require('../categories/getById');

async function byProvider(
  categoryId,
  criteria,
  { details = false, assets: assetsIds, category, transacting } = {}
) {
  if (!category && categoryId) {
    // eslint-disable-next-line no-param-reassign
    category = await getCategoryById(categoryId, { transacting });
  }

  if (!category) {
    throw new global.utils.HttpError(400, 'Category is required');
  }

  try {
    const provider = leemons.getProvider(category.provider);

    const assets = await provider.services.assets.search(criteria, {
      assets: assetsIds,
      transacting,
    });

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }

    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset in provider: ${e.message}`);
  }
}

module.exports = { byProvider };
