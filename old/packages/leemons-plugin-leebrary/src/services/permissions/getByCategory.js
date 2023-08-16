const {
  isEmpty,
  sortBy,
  intersection,
  uniqBy,
  uniq,
  forEach,
  findIndex,
  map,
  groupBy,
  find,
  omit,
  keyBy,
} = require('lodash');
const semver = require('semver');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');
const { getPublic } = require('./getPublic');
const { getByIds } = require('../assets/getByIds');
const { getByAssets } = require('./getByAssets');
const { byProvider: getByProvider } = require('../search/byProvider');
const { tables } = require('../tables');
const { getAssetsByProgram } = require('../assets/getAssetsByProgram');
const { getAssetsBySubject } = require('../assets/getAssetsBySubject');

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
    programs: _programs,
    subjects: _subjects,
    userSession,
    transacting,
  } = {}
) {
  // TODO: Search in provider
  try {
    let programs = _programs;
    let subjects = _subjects;

    if (!programs && providerQuery?.program) {
      programs = [providerQuery.program];
    }
    if (!subjects && providerQuery?.subjects) {
      subjects = providerQuery.subjects;
    }

    if (!providerQuery?.program && programs) {
      providerQuery.program = programs[0];
    }
    if (!providerQuery?.subjects && subjects) {
      providerQuery.subjects = subjects;
    }

    const { services: userService } = leemons.getPlugin('users');

    const [permissions, viewItems, editItems, assignItems] = await Promise.all([
      userService.permissions.getUserAgentPermissions(userSession.userAgents, {
        query: {
          permissionName_$startsWith: leemons.plugin.prefixPN(''),
          target: categoryId,
        },
        transacting,
      }),
      userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
        userSession.userAgents,
        leemons.plugin.prefixPN('asset.can-view'),
        { ignoreOriginalTarget: true, target: categoryId, transacting }
      ),
      userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
        userSession.userAgents,
        leemons.plugin.prefixPN('asset.can-edit'),
        { ignoreOriginalTarget: true, target: categoryId, transacting }
      ),
      userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
        userSession.userAgents,
        leemons.plugin.prefixPN('asset.can-assign'),
        { ignoreOriginalTarget: true, target: categoryId, transacting }
      ),
    ]);

    // ES: Incluir assets públicos tan solo si no se expecifican roles, o está el rol de viewer (que es el rol de los públicos)
    // EN: Include public assets only if no role is specified or the viewer role is included (which is the public assets role)
    const publicAssets =
      showPublic && (!roles?.length || roles.includes('view'))
        ? await getPublic(categoryId, { indexable, transacting })
        : [];
    // ES: Concatenamos todas las IDs, y luego obtenemos la intersección en función de su status
    // EN: Concatenate all IDs, and then get the intersection in accordance with their status
    let assetIds = uniq(
      permissions
        .map((item) => getAssetIdFromPermissionName(item.permissionName))
        .concat(publicAssets.map((item) => item.asset))
        .concat(viewItems)
        .concat(editItems)
        .concat(assignItems)
    );

    try {
      const { versionControl } = leemons.getPlugin('common').services;
      const assetByStatus = await versionControl.listVersionsOfType(
        leemons.plugin.prefixPN(categoryId),
        { published, preferCurrent, transacting }
      );

      assetIds = uniq(
        intersection(
          assetIds,
          assetByStatus.map((item) => item.fullId)
        )
      );
    } catch (e) {
      console.error(e);
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

    if (programs) {
      assetIds = await getAssetsByProgram(programs, { assets: assetIds, transacting });
    }

    if (subjects) {
      assetIds = await getAssetsBySubject(subjects, { assets: assetIds, transacting });
    }

    let results = permissions
      .map((item) => ({
        asset: getAssetIdFromPermissionName(item.permissionName),
        role: item.actionNames[0],
        permissions: getRolePermissions(item.actionNames[0]),
      }))
      .filter((item) => {
        if (roles?.length && !roles.includes(item.role)) {
          return false;
        }
        return assetIds.includes(item.asset);
      });

    if (!roles?.length || roles.includes('viewer')) {
      forEach(viewItems, (asset) => {
        const index = findIndex(results, { asset });
        if (index < 0 && assetIds.includes(asset)) {
          results.push({
            asset,
            role: 'viewer',
            permissions: getRolePermissions('viewer'),
          });
        }
      });
    }

    if (!roles?.length || roles.includes('assigner')) {
      forEach(assignItems, (asset) => {
        const index = findIndex(results, { asset });
        if (index >= 0) {
          if (results[index].role === 'viewer') {
            results[index].role = 'assigner';
            results[index].permissions = getRolePermissions('assigner');
          }
        } else if (assetIds.includes(asset)) {
          results.push({
            asset,
            role: 'assigner',
            permissions: getRolePermissions('assigner'),
          });
        }
      });
    }

    if (!roles?.length || roles.includes('editor')) {
      forEach(editItems, (asset) => {
        const index = findIndex(results, { asset });
        if (index >= 0) {
          if (results[index].role === 'viewer') {
            results[index].role = 'editor';
            results[index].permissions = getRolePermissions('editor');
          }
        } else if (assetIds.includes(asset)) {
          results.push({
            asset,
            role: 'editor',
            permissions: getRolePermissions('editor'),
          });
        }
      });
    }

    if (indexable === true) {
      const indexableAssetsIds = await tables.assets.find(
        { id_$in: map(results, 'asset'), indexable: true },
        { transacting, columns: ['id'] }
      );

      const indexableAssetsObject = indexableAssetsIds.reduce(
        (obj, { id }) => ({ ...obj, [id]: true }),
        {}
      );

      results = results.filter(({ asset }) => indexableAssetsObject[asset]);
    }

    results = uniqBy(
      results.concat(publicAssets.filter(({ asset }) => assetIds.includes(asset))),
      'asset'
    );

    if (preferCurrent) {
      const versionControlServices = leemons.getPlugin('common').services.versionControl;

      results = await Promise.all(
        results.map(async (asset) => ({
          ...(await versionControlServices.parseId(asset.asset, {
            verifyVersion: false,
            ignoreMissing: true,
          })),
          ...asset,
        }))
      );

      // TODO: Remove and use setAsCurrent on asset creation
      // EN: Filter by preferCurrent status
      // ES: Filtrar por estado preferCurrent
      const groupedAssets = groupBy(results, (asset) => asset.uuid);

      // EN: Get the latest versions of each uuid
      // ES: Obtener la última versión de cada uuid
      results = map(groupedAssets, (values) => {
        const versions = map(values, (id) => id.version);

        const latest = semver.maxSatisfying(versions, '*');

        return omit(
          find(values, (id) => id.version === latest),
          ['uuid', 'version', 'fullId']
        );
      });
    }

    let result = uniqBy(results, 'asset');

    // ES: Para el caso que necesite ordenación, necesitamos una lógica distinta
    // EN: For the case that you need sorting, we need a different logic
    if (sortingBy && !isEmpty(sortingBy)) {
      const [assets] = await Promise.all([
        getByIds(map(result, 'asset'), {
          withCategory: false,
          withTags: false,
          indexable,
          showPublic,
          userSession,
          transacting,
        }),
      ]);

      let sortedAssets = sortBy(assets, sortingBy);

      if (sortDirection === 'desc') {
        sortedAssets = sortedAssets.reverse();
      }

      assetIds = sortedAssets.map((item) => item.id);
      const _result = [];
      const resultByAsset = keyBy(result, 'asset');
      forEach(assetIds, (assetId) => {
        if (resultByAsset[assetId]) {
          _result.push(resultByAsset[assetId]);
        }
      });
      result = _result;
    }

    return result;
  } catch (e) {
    console.error(e);
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByCategory };
