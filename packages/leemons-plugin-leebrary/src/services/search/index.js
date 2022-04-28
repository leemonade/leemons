const { compact, uniq, uniqBy, flattenDeep, isEmpty, sortBy, intersection } = require('lodash');
const { byName: getByName } = require('./byName');
const { byTagline: getByTagline } = require('./byTagline');
const { byDescription: getByDescription } = require('./byDescription');
const { getByCategory } = require('../assets/getByCategory');
const { getByIds } = require('../assets/getByIds');
const { getByAssets: getPermissions } = require('../permissions/getByAssets');
const { getAssetsByType } = require('../files/getAssetsByType');
const { getById: getCategoryById } = require('../categories/getById');
const { getByKey: getCategoryByKey } = require('../categories/getByKey');
const { getByUser: getPinsByUser } = require('../pins/getByUser');

async function search(
  { criteria = '', type, category },
  {
    allVersions = false,
    sortBy: sortingBy,
    sortDirection = 'asc',
    published = true,
    preferCurrent,
    pinned,
    showPublic,
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

    if (pinned) {
      // console.log('-- Vamos a buscar en los assets pinneados --');
      const pins = await getPinsByUser({ userSession, transacting });
      assets = pins.map((pin) => pin.asset);
      nothingFound = assets.length === 0;
      // console.log('assets:');
      // console.log(assets);
    }

    if (!isEmpty(criteria)) {
      const tagsService = leemons.getPlugin('common').services.tags;

      const [byName, byTagline, byDescription, byTags] = await Promise.all([
        getByName(criteria, { assets, transacting }),
        getByTagline(criteria, { assets, transacting }),
        getByDescription(criteria, { assets, transacting }),
        // getByProvider(category, criteria, { assets, transacting }),
        tagsService.getTagsValues(criteria, {
          type: leemons.plugin.prefixPN(''),
          transacting,
        }),
      ]);

      const matches = byName.concat(byTagline).concat(byDescription);

      // ES: Si existen recursos, se debe a un filtro previo que debemos aplicar como intersección
      // EN: If there are resources, we must apply a previous filter as an intersection
      if (!isEmpty(assets)) {
        assets = intersection(matches, compact(uniq(flattenDeep(byTags))));
      } else {
        assets = compact(uniq(matches.concat(flattenDeep(byTags))));
      }

      nothingFound = assets.length === 0;
    }

    // console.log('-- Después de CRITERIA:');
    // console.log(assets);

    if (type) {
      assets = await getAssetsByType(type, { assets, transacting });
      nothingFound = assets.length === 0;
    }

    // console.log('-- Después de TYPE:');
    // console.log(assets);

    if (!nothingFound && !pinned) {
      const { versionControl } = leemons.getPlugin('common').services;
      const assetByStatus = await versionControl.listVersionsOfType(
        leemons.plugin.prefixPN(categoryId),
        { allVersions, published, preferCurrent, transacting }
      );

      assets = intersection(
        assets,
        assetByStatus.map((item) => item.fullId)
      );

      nothingFound = assets.length === 0;
    }

    // console.log('-- Después de VERSION CONTROL:');
    // console.log(assets);

    // ES: Si viene la categoría, filtramos todo el array de Assets con respecto a esa categoría
    // EN: If we have the category, we filter the array of Assets with respect to that category
    if (!nothingFound && categoryId) {
      assets = (await getByCategory(categoryId, { assets: uniq(assets), transacting })).map(
        ({ id }) => id
      );
      nothingFound = assets.length === 0;
    }

    // console.log('-- Después de CATEGORY:');
    // console.log(assets);

    // EN: Only return assets that the user has permission to view
    // ES: Sólo devuelve los recursos que el usuario tiene permiso para ver
    if (!nothingFound) {
      assets = await getPermissions(uniq(assets), { showPublic, userSession, transacting });
      nothingFound = assets.length === 0;
    }

    // console.log('-- Después de PERMISSIONS:');
    // console.log(assets);

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

    return uniqBy(assets, 'id') || [];
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with query: ${e.message}`);
  }
}

module.exports = { search };
