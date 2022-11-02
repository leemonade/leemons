const { isEmpty, sortBy, intersection, uniqBy, uniq } = require('lodash');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');
const { getPublic } = require('./getPublic');
const { getByIds } = require('../assets/getByIds');
const { getByAssets } = require('./getByAssets');
const { byProvider: getByProvider } = require('../search/byProvider');

async function getByCategory(
  categoryId,
  {
    sortBy: sortingBy,
    sortDirection = 'asc',
    published = true,
    indexable = true,
    preferCurrent,
    showPublic,
    roles,
    searchInProvider,
    providerQuery,
    userSession,
    transacting,
  } = {}
) {
  // TODO: Search in provider
  try {
    const { services: userService } = leemons.getPlugin('users');
    console.time('end');

    const permissions = await userService.permissions.getUserAgentPermissions(
      userSession.userAgents,
      {
        query: {
          permissionName_$startsWith: leemons.plugin.prefixPN(''),
          target: categoryId,
        },
        transacting,
      }
    );

    const publicAssets = showPublic ? await getPublic(categoryId, { indexable, transacting }) : [];
    // ES: Concatenamos todas las IDs, y luego obtenemos la intersección en función de su status
    // EN: Concatenate all IDs, and then get the intersection in accordance with their status
    let assetIds = permissions
      .map((item) => getAssetIdFromPermissionName(item.permissionName))
      .concat(publicAssets.map((item) => item.asset));

    try {
      console.time('3');
      const { versionControl } = leemons.getPlugin('common').services;
      const assetByStatus = await versionControl.listVersionsOfType(
        leemons.plugin.prefixPN(categoryId),
        { published, preferCurrent, transacting }
      );
      console.timeEnd('3');

      assetIds = uniq(
        intersection(
          assetIds,
          assetByStatus.map((item) => item.fullId)
        )
      );
    } catch (e) {
      console.error(e);
      console.timeEnd('3');
      leemons.log.error(`Failed to get asset by status from categoryId ${categoryId}`);
    }

    // ES: Buscamos en el provider si se ha indicado
    // EN: Search in the provider if indicated so
    if (searchInProvider) {
      try {
        assetIds = await getByProvider(categoryId, '', {
          query: providerQuery,
          assets: assetIds,
          published,
          preferCurrent,
          userSession,
          transacting,
        });
      } catch (e) {
        leemons.log.error(`Failed to get assets from provider: ${e.message}`);
      }
    }

    // ES: Para el caso que necesite ordenación, necesitamos una lógica distinta
    // EN: For the case that you need sorting, we need a different logic
    if (sortingBy && !isEmpty(sortingBy)) {
      const [assets, assetsAccessibles] = await Promise.all([
        getByIds(assetIds, {
          withCategory: false,
          withTags: false,
          indexable,
          showPublic,
          userSession,
          transacting,
        }),
        getByAssets(assetIds, { showPublic, userSession, transacting }),
      ]);

      let sortedAssets = sortBy(assets, sortingBy);

      if (sortDirection === 'desc') {
        sortedAssets = sortedAssets.reverse();
      }

      const sortedIds = sortedAssets.map((item) => item.id);

      return assetsAccessibles.sort(
        (a, b) => sortedIds.indexOf(a.asset) - sortedIds.indexOf(b.asset)
      );
    }

    const results = permissions
      .map((item) => ({
        asset: getAssetIdFromPermissionName(item.permissionName),
        role: item.actionNames[0],
        permissions: getRolePermissions(item.actionNames[0]),
      }))
      .concat(publicAssets)
      .filter((item) => {
        if (roles?.length && !roles.includes(item.role)) {
          return false;
        }
        return assetIds.includes(item.asset);
      });
    console.timeEnd('end');
    return uniqBy(results, 'asset');
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByCategory };
