const { compact, uniq, flattenDeep, isEmpty } = require('lodash');
const { byDescription } = require('./byDescription');
const { byName } = require('./byName');
const { getByCategory } = require('../assets/getByCategory');
const { getByIds } = require('../assets/getByIds');
const { getByAssets: getPermissions } = require('../permissions/getByAssets');
const { getAssetsByType } = require('../files/getAssetsByType');

async function search(
  { criteria = '', type, category },
  { details = false, userSession, transacting } = {}
) {
  let assets = [];
  let nothingFound = false;

  try {
    if (!isEmpty(criteria)) {
      const tagsService = leemons.getPlugin('common').services.tags;

      const result = await Promise.all([
        byName(criteria, { transacting }),
        byDescription(criteria, { transacting }),
        tagsService.getTagsValues(criteria, {
          type: leemons.plugin.prefixPN(''),
          transacting,
        }),
      ]);

      assets = result[0].concat(result[1]);
      assets = compact(uniq(assets.concat(flattenDeep(result[2]))));
      nothingFound = assets.length === 0;
    }

    // ES: Si viene la categoría, filtramos todo el array de Assets con respecto a esa categoría
    // EN: If we have the category, we filter the array of Assets with respect to that category
    if (!nothingFound && category) {
      assets = (await getByCategory(category, { assets: uniq(assets), transacting })).map(
        ({ id }) => id
      );
    }

    if (!nothingFound && type) {
      assets = await getAssetsByType(type, { assets, transacting });
    }

    // EN: Only return assets that the user has permission to view
    // ES: Sólo devuelve los recursos que el usuario tiene permiso para ver
    if (!isEmpty(assets)) {
      assets = await getPermissions(uniq(assets), { userSession, transacting });
    }

    // EN: If the user wants to see the details of the assets, we need to get the details
    // ES: Si el usuario quiere ver los detalles de los recursos, necesitamos obtener los detalles
    if (details && !isEmpty(assets)) {
      return await getByIds(
        assets.map(({ asset }) => asset),
        { withFiles: true, transacting }
      );
    }

    return assets || [];
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with query: ${e.message}`);
  }
}

module.exports = { search };
