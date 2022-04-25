const { compact, uniq, flattenDeep, isEmpty, sortBy } = require('lodash');
const { byDescription } = require('./byDescription');
const { byName } = require('./byName');
const { getByCategory } = require('../assets/getByCategory');
const { getByIds } = require('../assets/getByIds');
const { getByAssets: getPermissions } = require('../permissions/getByAssets');
const { getAssetsByType } = require('../files/getAssetsByType');

async function search(
  { criteria = '', type, category },
  { sortBy: sortingBy, sortDirection = 'asc', userSession, transacting } = {}
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

    // ES: Para el caso que necesite ordenación, necesitamos una lógica distinta
    // EN: For the case that you need sorting, we need a different logic
    if (!isEmpty(assets) && sortingBy && !isEmpty(sortingBy)) {
      const assetIds = assets.map((item) => item.asset);

      const [items] = await Promise.all([
        getByIds(assetIds, { withCategory: false, withTags: false, userSession, transacting }),
      ]);

      let sortedAssets = sortBy(items, sortingBy);

      if (sortDirection === 'desc') {
        sortedAssets = sortedAssets.reverse();
      }

      const sortedIds = sortedAssets.map((item) => item.id);

      assets.sort((a, b) => sortedIds.indexOf(a.asset) - sortedIds.indexOf(b.asset));
    }

    return assets || [];
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with query: ${e.message}`);
  }
}

module.exports = { search };
