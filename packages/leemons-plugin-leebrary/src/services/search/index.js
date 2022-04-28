const { compact, uniq, uniqBy, flattenDeep, isEmpty, sortBy, intersection } = require('lodash');
const { byDescription } = require('./byDescription');
const { byName } = require('./byName');
const { getByCategory } = require('../assets/getByCategory');
const { getByIds } = require('../assets/getByIds');
const { getByAssets: getPermissions } = require('../permissions/getByAssets');
const { getAssetsByType } = require('../files/getAssetsByType');
const { getById: getCategoryById } = require('../categories/getById');
const { getByKey: getCategoryByKey } = require('../categories/getByKey');

async function search(
  { criteria = '', type, category },
  {
    allVersions = false,
    sortBy: sortingBy,
    sortDirection = 'asc',
    published = true,
    preferCurrent,
    userSession,
    transacting,
  } = {}
) {
  let assets = [];
  let nothingFound = false;

  try {
    let categoryId;
    if (category) {
      let _category;

      if (
        category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      ) {
        // eslint-disable-next-line no-param-reassign
        _category = await getCategoryById(category, { columns: ['id'], transacting });
      } else {
        // eslint-disable-next-line no-param-reassign
        _category = await getCategoryByKey(category, { columns: ['id'], transacting });
      }
      categoryId = _category.id;
    }

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

    if (type) {
      assets = await getAssetsByType(type, { assets, transacting });
      nothingFound = assets.length === 0;
    }

    if (!nothingFound) {
      const { versionControl } = leemons.getPlugin('common').services;
      const assetByStatus = await versionControl.listVersionsOfType(
        leemons.plugin.prefixPN(categoryId),
        { allVersions, published, preferCurrent, transacting }
      );

      assets = assets.length
        ? intersection(
            assets,
            assetByStatus.map((item) => item.fullId)
          )
        : assetByStatus.map((item) => item.fullId);

      nothingFound = assets.length === 0;
    }

    // ES: Si viene la categoría, filtramos todo el array de Assets con respecto a esa categoría
    // EN: If we have the category, we filter the array of Assets with respect to that category
    if (!nothingFound && categoryId) {
      assets = (await getByCategory(categoryId, { assets: uniq(assets), transacting })).map(
        ({ id }) => id
      );
      nothingFound = assets.length === 0;
    }

    // EN: Only return assets that the user has permission to view
    // ES: Sólo devuelve los recursos que el usuario tiene permiso para ver
    if (!nothingFound) {
      assets = await getPermissions(uniq(assets), { userSession, transacting });
      nothingFound = assets.length === 0;
    }

    // ES: Para el caso que necesite ordenación, necesitamos una lógica distinta
    // EN: For the case that you need sorting, we need a different logic
    if (!nothingFound && sortingBy && !isEmpty(sortingBy)) {
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

    return uniqBy(assets, 'asset') || [];
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with query: ${e.message}`);
  }
}

module.exports = { search };
