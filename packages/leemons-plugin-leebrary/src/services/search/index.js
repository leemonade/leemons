const byTags = require('../assets/tags/getAssets');
const { byDescription } = require('./byDescription');
const { byName } = require('./byName');
const { getByCategory } = require('../assets/getByCategory');
const { getByIds } = require('../assets/getByIds');
const { getByAssets: getPermissions } = require('../permissions/getByAssets');

function saveResults(newResults, existingResults) {
  if (existingResults === null) {
    return newResults;
  }
  return newResults;
}

async function search(query, { details = false, userSession, transacting } = {}) {
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
      assets = await saveResults(
        await getByCategory(query.category, { assets, transacting }),
        assets
      );
    }

    const permissions = await getPermissions(assets, { userSession, transacting });

    // EN: Only return assets that the user has permission to view
    // ES: Sólo devuelve los recursos que el usuario tiene permiso para ver
    assets = permissions.map(({ asset }) => asset);

    // EN: If the user wants to see the details of the assets, we need to get the details
    // ES: Si el usuario quiere ver los detalles de los recursos, necesitamos obtener los detalles
    if (details && assets.length) {
      return await getByIds(assets, { withFiles: true, transacting });
    }

    return assets || [];
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with query: ${e.message}`);
  }
}

module.exports = { search };
