const { isEmpty, sortBy, intersection } = require('lodash');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');
const { getPublic } = require('./getPublic');
const { getByIds } = require('../assets/getByIds');
const { getByAssets } = require('./getByAssets');

async function getByCategory(
  categoryId,
  {
    sortBy: sortingBy,
    sortDirection = 'asc',
    published = true,
    preferCurrent,
    userSession,
    transacting,
  } = {}
) {
  try {
    const { services: userService } = leemons.getPlugin('users');
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

    const publicAssets = await getPublic(categoryId, { transacting });

    // ES: Concatenamos todas las IDs, y luego obtenemos la intersección en función de su status
    // EN: Concatenate all IDs, and then get the intersection in accordance with their status
    let assetIds = permissions
      .map((item) => getAssetIdFromPermissionName(item.permissionName))
      .concat(publicAssets.map((item) => item.asset));

    const { versionControl } = leemons.getPlugin('common').services;
    const assetByStatus = await versionControl.listVersionsOfType(
      leemons.plugin.prefixPN(categoryId),
      { published, preferCurrent, transacting }
    );

    assetIds = intersection(
      assetIds,
      assetByStatus.map((item) => item.fullId)
    );

    // ES: Para el caso que necesite ordenación, necesitamos una lógica distinta
    // EN: For the case that you need sorting, we need a different logic
    if (sortingBy && !isEmpty(sortingBy)) {
      const [assets, assetsAccessibles] = await Promise.all([
        getByIds(assetIds, { withCategory: false, withTags: false, userSession, transacting }),
        getByAssets(assetIds, { userSession, transacting }),
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

    return permissions
      .map((item) => ({
        asset: getAssetIdFromPermissionName(item.permissionName),
        role: item.actionNames[0],
        permissions: getRolePermissions(item.actionNames[0]),
      }))
      .concat(publicAssets)
      .filter((item) => assetIds.includes(item.asset));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByCategory };
