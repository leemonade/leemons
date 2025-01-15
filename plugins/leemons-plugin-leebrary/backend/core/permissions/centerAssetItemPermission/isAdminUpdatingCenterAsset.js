const { SYS_PROFILE_NAMES } = require('@leemons/users');

const { getCenterPermissionName } = require('./getCenterPermissionData');

const PROFILES_WITH_ADMIN_MANAGEABLE_ASSETS = [SYS_PROFILE_NAMES.CONTENT_DEVELOPER];

async function isAdminUpdatingCenterAsset({ asset, ctx }) {
  const [[assetOwnerUserAgent], [currentUserAgent]] = await Promise.all([
    await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: [asset.fromUserAgent],
      withCenter: true,
      withProfile: true,
      ctx,
    }),
    await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: [ctx.meta.userSession.userAgents[0].id],
      withCenter: true,
      withProfile: true,
      ctx,
    }),
  ]);

  if (
    currentUserAgent.profile.sysName !== SYS_PROFILE_NAMES.ADMIN ||
    !PROFILES_WITH_ADMIN_MANAGEABLE_ASSETS.includes(assetOwnerUserAgent?.profile?.sysName)
  ) {
    return false;
  }

  return ctx.tx.call('users.permissions.existItems', {
    query: {
      permissionName: getCenterPermissionName({ centerId: assetOwnerUserAgent.center.id }),
      item: asset.id,
      actionName: 'editor',
    },
  });
}

module.exports = { isAdminUpdatingCenterAsset };
