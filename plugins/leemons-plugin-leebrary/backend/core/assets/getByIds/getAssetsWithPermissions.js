/* eslint-disable no-param-reassign */
const { keyBy, isEmpty, map, find, uniq, uniqBy, filter, forEach } = require('lodash');
const { getByAssets: getPermissions } = require('../../permissions/getByAssets');
const getAssetPermissionName = require('../../permissions/helpers/getAssetPermissionName');
const { getClassesPermissions } = require('../../permissions/getClassesPermissions');
const canUnassignRole = require('../../permissions/helpers/canUnassignRole');
/**
 * Fetches assets with permissions
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch permissions for
 * @param {Array} params.assetsIds - The IDs of the assets
 * @param {boolean} params.showPublic - Flag to show public assets
 * @param {MoleculerContext} params.ctx - The moleculer context
 * @returns {Promise<Array>} - Returns an array of assets with permissions
 */
async function getAssetsWithPermissions({ assets, assetsIds, showPublic, ctx }) {
  const classesPermissionsPerAsset = await getClassesPermissions({
    assetsIds: map(assets, 'id'),
    withInfo: true,
    ctx,
  });

  let permissions = [];

  if (ctx.meta.userSession || showPublic) {
    permissions = await getPermissions({ assetsIds, showPublic, ctx });
  }

  const privateAssets = permissions.map((item) => item.asset);
  // eslint-disable-next-line no-param-reassign
  assets = assets.filter((asset) => privateAssets.includes(asset.id));

  const getUsersAssetIds = [];
  for (let i = 0, l = assets.length; i < l; i++) {
    const asset = assets[i];
    asset.isPrivate = true;
    const classesWithPermissions = classesPermissionsPerAsset[i];
    if (classesWithPermissions?.length) {
      asset.isPrivate = false;
    }
    asset.classesCanAccess = classesWithPermissions;
    const permission = permissions.find((item) => item.asset === asset.id);
    if (!isEmpty(permission?.permissions)) {
      // const { permissions: userPermissions } = permission;
      // if (userPermissions.edit) {
      getUsersAssetIds.push(asset.id);
      // }
    }
  }
  // [assetone, assetTwo] asset ids
  if (getUsersAssetIds.length) {
    const permissionNames = map(getUsersAssetIds, (permit) =>
      getAssetPermissionName({ assetId: permit, ctx })
    );
    const rawUserAgents = await ctx.tx.call('users.permissions.findUsersWithPermissions', {
      permissions: {
        permissionName: permissionNames,
      },
      returnRaw: true,
    });
    const userAgentIds = uniq(map(rawUserAgents, 'userAgent'));
    const userAgents = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds,
    });
    const userAgentsById = keyBy(userAgents, 'id');
    // {userAgentId1: { user, role, disabled}, userAgentId2: {...}}

    for (let i = 0, l = assets.length; i < l; i++) {
      const asset = assets[i];
      if (getUsersAssetIds.includes(asset.id)) {
        const permission = permissions.find((item) => item.asset === asset.id);
        const assetPermissionName = getAssetPermissionName({ assetId: asset.id, ctx });
        const { role: userRole } = permission;
        // userRole: 1st owner, 2nd editor
        const rawPerm = filter(
          rawUserAgents,
          ({ permissionName }) => permissionName === assetPermissionName
        );
        const assetUserAgents = uniqBy(rawPerm, 'userAgent');
        // userAgent1, luego userAgent2

        let assetPermissions = [];
        // { ...user, userAgentIds: [userAgent.id], permissions: ['owner'], editable: true}
        // { ...user, userAgentIds: [userAgent.id], permissions: ['editor'], editable: true}
        forEach(assetUserAgents, (raw) => {
          const userAgent = userAgentsById[raw.userAgent];
          const perm = find(assetPermissions, { id: userAgent.user.id });
          if (perm) {
            perm.userAgentIds.push(userAgent.id);
            perm.permissions.push(raw.actionName); // ? actionName? isn't it action?
          } else {
            assetPermissions.push({
              ...userAgent.user,
              userAgentIds: [userAgent.id],
              permissions: [raw.actionName], // ? actionName? isn't it action?
            });
          }
        });

        assetPermissions = assetPermissions.map((user) => {
          const item = { ...user };
          item.editable = canUnassignRole({
            userRole,
            assignedUserCurrentRole: item.permissions[0],
            ctx,
          });
          return item;
        });

        assets[i].canAccess = assetPermissions;
        if (assets[i].canAccess?.length) {
          const noOwners = filter(
            assets[i].canAccess,
            (item) => !item.permissions?.includes('owner')
          );
          if (noOwners.length) {
            assets[i].isPrivate = false;
          }
        }

        const _permission = permissions.find((item) => item.asset === asset.id);
        if (!isEmpty(_permission?.permissions)) {
          const { permissions: userPermissions } = _permission;
          if (!userPermissions.edit) {
            const owner = find(assets[i].canAccess, (item) => item.permissions?.includes('owner'));
            assets[i].canAccess = null;
            if (owner) {
              assets[i].canAccess = [owner];
            }
          }
        }
      }
    }
  }

  return assets;
}

module.exports = { getAssetsWithPermissions };
