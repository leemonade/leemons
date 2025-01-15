const { SYS_PROFILE_NAMES } = require('@leemons/users');

const { addCenterItemPermission } = require('./addCenterItemPermission');
const { getCenterPermissionData } = require('./getCenterPermissionData');
const { shouldAssetHavePermission } = require('./shouldAssetHavePermission');

const ALLOWED_PROFILES = [SYS_PROFILE_NAMES.CONTENT_DEVELOPER];
const SET_ACTIONS = { add: 'add', remove: 'remove' };

async function determinePermissionAction({
  assetDetail,
  centerAssetPermissionName,
  isPublishing,
  ctx,
}) {
  const hasCenterPermission = await ctx.tx.call('users.permissions.existItems', {
    query: {
      permissionName: centerAssetPermissionName,
      item: assetDetail.id,
      actionName: 'editor',
    },
  });

  const shouldHavePermission = await shouldAssetHavePermission({ assetDetail, isPublishing, ctx });

  if (hasCenterPermission) {
    return shouldHavePermission ? null : 'remove';
  }

  return shouldHavePermission ? 'add' : null;
}

async function set({ assetId, isPublishing = false, ctx }) {
  const [userAgentInfo] = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: [ctx.meta.userSession.userAgents[0].id],
    withCenter: true,
    withProfile: true,
    ctx,
  });

  if (ALLOWED_PROFILES.includes(userAgentInfo?.profile?.sysName)) {
    const { assetDetail, centerAssetPermissionName } = await getCenterPermissionData({
      assetId,
      centerId: userAgentInfo.center.id,
      ctx,
    });

    const action = await determinePermissionAction({
      assetDetail,
      centerAssetPermissionName,
      isPublishing,
      ctx,
    });

    if (action === SET_ACTIONS.add) {
      const success = await addCenterItemPermission({
        assetObject: assetDetail,
        permissionName: centerAssetPermissionName,
        skipGetData: true,
        ctx,
      });
      return { success, action: SET_ACTIONS.add };
    } else if (action === SET_ACTIONS.remove) {
      await ctx.tx.call('users.permissions.removeItems', {
        query: {
          permissionName: centerAssetPermissionName,
          type: ctx.prefixPN('asset.can-edit'),
          item: assetId,
          actionName: 'editor',
        },
      });
      return { success: true, action: SET_ACTIONS.remove };
    }
  }

  return { success: false, action: null };
}

module.exports = { set };
