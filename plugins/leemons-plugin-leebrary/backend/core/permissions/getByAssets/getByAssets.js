const { flattenDeep, forEach, findIndex } = require('lodash');
const { LeemonsError } = require('@leemons/error');

const getRolePermissions = require('../helpers/getRolePermissions');
const getAssetPermissionName = require('../helpers/getAssetPermissionName');
const getAssetIdFromPermissionName = require('../helpers/getAssetIdFromPermissionName');
const { handleOnlyShared } = require('./handleOnlyShared');
const { handleItemPermissions } = require('./handleItemPermissions');

// eslint-disable-next-line sonarjs/cognitive-complexity
async function getByAssets({ assetIds, showPublic, onlyShared, ctx }) {
  const { userSession } = ctx.meta;
  let assetsIds = flattenDeep([assetIds]);

  try {
    let permissions = [];
    let viewItems = [];
    let editItems = [];
    let assignItems = [];
    if (userSession && userSession?.userAgents) {
      permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
        userAgent: userSession.userAgents,
        query: {
          $or: assetsIds.map((id) => ({
            permissionName: { $regex: getAssetPermissionName({ assetId: id, ctx }), $options: 'i' },
          })),
        },
      });
    }

    if (onlyShared) {
      [permissions, assetsIds] = handleOnlyShared({ permissions, assetsIds });
    }

    if (userSession && userSession?.userAgents) {
      [viewItems, editItems, assignItems] = await handleItemPermissions({
        assetsIds,
        userAgents: userSession.userAgents,
        ctx,
      });
    }

    const publicAssets = showPublic
      ? await ctx.tx.db.Assets.find({ id: assetsIds, public: true }).select(['id', 'public']).lean()
      : [];

    const results = permissions.concat(publicAssets).map((item) => ({
      asset: item.public ? item.id : getAssetIdFromPermissionName(item.permissionName),
      role: item.public ? 'public' : item.actionNames[0],
      permissions: getRolePermissions({ role: item.public ? 'public' : item.actionNames[0], ctx }),
    }));

    forEach(viewItems, (asset) => {
      const index = findIndex(results, { asset });
      if (index < 0) {
        results.push({
          asset,
          role: 'viewer',
          permissions: getRolePermissions({ role: 'viewer', ctx }),
        });
      }
    });

    forEach(assignItems, (asset) => {
      const index = findIndex(results, { asset });
      if (index >= 0) {
        if (results[index].role === 'viewer') {
          results[index].role = 'assigner';
          results[index].permissions = getRolePermissions({ role: 'assigner', ctx });
        }
      } else {
        results.push({
          asset,
          role: 'assigner',
          permissions: getRolePermissions({ role: 'assigner', ctx }),
        });
      }
    });

    forEach(editItems, (asset) => {
      const index = findIndex(results, { asset });
      if (index >= 0) {
        if (results[index].role === 'viewer') {
          results[index].role = 'editor';
          results[index].permissions = getRolePermissions({ role: 'editor', ctx });
        }
      } else {
        results.push({
          asset,
          role: 'editor',
          permissions: getRolePermissions({ role: 'editor', ctx }),
        });
      }
    });

    return results;
  } catch (e) {
    ctx.logger.error(e);
    throw new LeemonsError(ctx, {
      message: `Failed to get permissions: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByAssets };
