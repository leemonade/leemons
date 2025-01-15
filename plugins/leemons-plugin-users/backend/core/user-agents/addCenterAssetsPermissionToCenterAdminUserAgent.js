const { SYS_PROFILE_NAMES, CENTER_ASSETS_PERMISSION_PREFIX } = require('../../config/constants');

async function addCenterAssetsPermissionToCenterAdminUserAgent({ userAgent, ctx }) {
  const [userAgentInfo] = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: [userAgent.id],
    withCenter: true,
    withProfile: true,
    ctx,
  });

  if (userAgentInfo.profile.sysName === SYS_PROFILE_NAMES.ADMIN) {
    const centerId = userAgentInfo.center.id;
    const centerAssetPermissionName = `${CENTER_ASSETS_PERMISSION_PREFIX}.${centerId}`;

    return ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
      userAgentId: userAgentInfo.id,
      data: {
        permissionName: centerAssetPermissionName,
        actionNames: ['editor'],
      },
    });
  }

  return null;
}

module.exports = { addCenterAssetsPermissionToCenterAdminUserAgent };
