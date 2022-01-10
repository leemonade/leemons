const byTags = require('../assets/tags/getAssets');
const byDescription = require('./byDescription');
const byName = require('./byName');
const byCategory = require('../assets/categories/getAssets');
const assetDetails = require('../assets/details');

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

    if (details && assets.length) {
      return await assetDetails(assets, { transacting });
    }

    return assets || [];
  } catch (e) {
    throw new Error(`Failed to find asset with query: ${e.message}`);
  }
};
