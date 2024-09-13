const { LeemonsError } = require('@leemons/error');
const { uniqBy, flattenDeep, forEach, findIndex, escapeRegExp } = require('lodash');

const getAssetIdFromPermissionName = require('../helpers/getAssetIdFromPermissionName');
const getAssetPermissionName = require('../helpers/getAssetPermissionName');
const getRolePermissions = require('../helpers/getRolePermissions');

const { handleItemPermissions } = require('./handleItemPermissions');
const { handleOnlyShared } = require('./handleOnlyShared');

/**
 * Retrieves permissions by assets.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array<string>} params.assetIds - The IDs of the assets which permissions we want to retrieve.
 * @param {boolean} params.showPublic - Whether to show public assets.
 * @param {boolean} params.onlyShared - Whether to only show shared assets.
 * @param {Array<string>} params.ownerUserAgentIds - The IDs of the userAgents that are the owners of the assets.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise} A promise that resolves with the permissions.
 */

// eslint-disable-next-line sonarjs/cognitive-complexity
async function getByAssets({ assetIds, showPublic, onlyShared, ownerUserAgentIds, ctx }) {
  const { userSession } = ctx.meta;
  let assetsIds = flattenDeep([assetIds]);

  let ownerUserAgents = [];
  if (ownerUserAgentIds) {
    ownerUserAgents = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: ownerUserAgentIds,
    });
  }

  const userAgents = [...ownerUserAgents, ...userSession.userAgents];

  try {
    let permissions = [];
    let viewItems = [];
    let editItems = [];
    let assignItems = [];
    if (userAgents) {
      permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
        userAgent: userAgents,
        query: {
          $or: assetsIds.map((id) => {
            const rx = escapeRegExp(getAssetPermissionName({ assetId: id, ctx }));
            return { permissionName: { $regex: rx, $options: 'i' } };
          }),
        },
      });
    }

    if (onlyShared) {
      [permissions, assetsIds] = handleOnlyShared({ permissions, assetsIds });
    }

    if (userAgents) {
      [viewItems, editItems, assignItems] = await handleItemPermissions({
        assetsIds,
        userAgents,
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

    return uniqBy(results, 'asset');
  } catch (e) {
    ctx.logger.error(e);
    throw new LeemonsError(ctx, {
      message: `Failed to get permissions: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByAssets };
