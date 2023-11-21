const { map, difference, omit } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getRoles } = require('../../roles');
const { getSubjects } = require('../../subjects');
const { getAsset } = require('../../leebrary/assets');
const { getUserPermissions } = require('../../permissions/assignables/users/getUserPermissions');

/**
 * Fetches assignables based on provided ids and showDeleted flag.
 * It constructs a query to find assignables either by their id or asset id.
 * It then fetches the assignables from the database and maps their ids and asset ids.
 *
 * @async
 * @function fetchAssignables
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.ids - The ids of the assignables to fetch.
 * @param {boolean} params.showDeleted - Flag to include deleted assignables.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<AssignablesAssignable>} The fetched assignables, their ids and asset ids.
 */

async function fetchAssignables({ ids, showDeleted, ctx }) {
  const query = {
    $or: [
      {
        id: ids,
      },
      {
        asset: ids,
      },
    ],
  };

  const assignables = await ctx.tx.db.Assignables.find(query, '', {
    excludeDeleted: !showDeleted,
  }).lean();

  const idsFound = map(assignables, 'id');
  const assetsFound = map(assignables, 'asset');

  return {
    assignables,
    idsFound,
    assetsFound,
  };
}

/**
 * Get assignables without permission
 * @function getNoPermissionAssignables
 * @param {Object} permissions - The permissions object.
 * @returns {Object} The assignables without permission.
 */
function getNoPermissionAssignables({ permissions }) {
  const noPermissionAssignables = {};

  Object.entries(permissions).forEach(([assignable, permission]) => {
    if (!permission.actions.includes('view')) {
      noPermissionAssignables[assignable] = true;
    }
  });

  return noPermissionAssignables;
}

/**
 * Get the publish state of assignables
 * @async
 * @function getAssignablesPublishState
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.ids - The ids of the assignables to fetch.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The publish state of assignables.
 */
async function getAssignablesPublishState({ ids, ctx }) {
  const versions = await ctx.tx.call('common.versionControl.getVersion', {
    id: ids,
  });

  return Object.fromEntries(versions.map((version) => [version.fullId, version.published]));
}

/**
 * Get the asset data of assignables
 * @async
 * @function getAssetData
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.ids - The ids of the assignables to fetch.
 * @param {Array<string>} params.columns - The columns to include in the result.
 * @param {boolean} params.withFiles - Flag to include files in the result.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The asset data of assignables.
 */
async function getAssetData({ ids, columns, withFiles, ctx }) {
  if (!columns.includes('asset')) {
    return {};
  }

  const assets = await getAsset({ id: ids, withFiles, ctx });

  const assetsByIds = {};

  assets.forEach((asset) => {
    assetsByIds[asset.id] = omit(asset, ['providerData']);
  });

  return assetsByIds;
}

/**
 * Get assignables
 * @async
 * @function getAssignables
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.ids - The ids of the assignables to fetch.
 * @param {Array<string>} params.columns - The columns to include in the result.
 * @param {boolean} params.withFiles - Flag to include files in the result.
 * @param {boolean} params.showDeleted - Flag to include deleted assignables.
 * @param {boolean} params.throwOnMissing - Flag to throw an error if an assignable is missing.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<AssignablesAssignable>>} The fetched assignables.
 */
async function getAssignables({
  ids,
  columns = ['asset'],
  withFiles,
  showDeleted = true,
  throwOnMissing = true,
  ctx,
}) {
  let { assignables, assetsFound, idsFound } = await fetchAssignables({
    ids,
    showDeleted,
    ctx,
  });

  if (throwOnMissing && difference(ids, idsFound.concat(assetsFound))?.length) {
    throw new LeemonsError(ctx, {
      message:
        "You don't have permissions to see some of the requested assignables or they do not exist",
      httpStatusCode: 404,
    });
  }

  const permissions = await getUserPermissions({
    assignables,
    ctx,
  });

  const noPermissionAssignables = await getNoPermissionAssignables({
    permissions,
  });

  if (throwOnMissing && Object.keys(noPermissionAssignables).length > 0) {
    throw new LeemonsError(ctx, {
      message:
        "You don't have permissions to see some of the requested assignables or they do not exist",
      httpStatusCode: 404,
    });
  } else if (Object.keys(noPermissionAssignables).length) {
    assignables = assignables.filter(({ id }) => !noPermissionAssignables[id]);
    idsFound = map(assignables, 'id');
    assetsFound = map(assignables, 'asset');
  }

  const promises = [
    getAssignablesPublishState({ ids: idsFound, ctx }),
    getRoles({
      roles: map(assignables, 'role'),
      ctx,
    }),
    getSubjects({ assignableIds: idsFound, ctx }),
    getAssetData({ ids: assetsFound, columns, withFiles, ctx }),
  ];

  const [publishState, roles, subjects, assetsData] = await Promise.all(promises);

  return assignables.map((assignable) => ({
    ...assignable,
    published: publishState[assignable.id],
    roleDetails: roles[assignable.role],
    subjects: subjects[assignable.id] ?? [],
    asset: assetsData[assignable.asset] || assignable.asset,
    resources: assignable.resources ?? [],
  }));
}

module.exports = { getAssignables };
