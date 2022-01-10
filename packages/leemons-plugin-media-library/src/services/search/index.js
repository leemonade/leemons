const byTags = require('../assets/tags/getAssets');
const byDescription = require('./byDescription');
const byName = require('./byName');
const byCategory = require('../assets/categories/getAssets');
const assetDetails = require('../assets/details');
const has = require('../permissions/has');

function saveResults(newResults, existingResults) {
  if (existingResults === null) {
    return newResults;
  }
  return newResults;
}

module.exports = async function search(query, { details = false, userSession, transacting } = {}) {
  let assets = null;
  try {
    if (query.name) {
      assets = await saveResults(await byName(query.name, { assets, transacting }), assets);
    }

    if (query.description) {
      assets = await saveResults(
        await byDescription(query.description, { assets, transacting }),
        assets
      );
    }

    if (query.tags) {
      assets = await saveResults(
        await byTags(JSON.parse(query.tags), { assets, transacting }),
        assets
      );
    }

    if (query.category) {
      assets = await saveResults(await byCategory(query.category, { assets, transacting }), assets);
    }

    // EN: Only return assets that the user has permission to view
    // ES: Sólo devuelve los recursos que el usuario tiene permiso para ver
    assets = assets
      .map(async (asset) => ({
        permissions: await has(asset, 'view', { userSession, transacting }),
        asset,
      }))
      .filter(({ permissions }) => permissions)
      .map(({ asset }) => asset);

    // EN: If the user wants to see the details of the assets, we need to get the details
    // ES: Si el usuario quiere ver los detalles de los recursos, necesitamos obtener los detalles
    if (details && assets.length) {
      return await assetDetails(assets, { transacting });
    }

    return assets || [];
  } catch (e) {
    throw new Error(`Failed to find asset with query: ${e.message}`);
  }
};
