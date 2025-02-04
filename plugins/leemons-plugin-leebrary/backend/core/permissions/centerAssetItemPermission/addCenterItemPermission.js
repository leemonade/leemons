const { getCenterPermissionData } = require('./getCenterPermissionData');

async function addCenterItemPermission({
  ctx,
  assetId,
  centerId,
  skipGetData = false,
  permissionName = null,
  assetObject = null,
}) {
  let assetDetail = assetObject;
  let centerAssetPermissionName = permissionName;

  if (!skipGetData) {
    ({ assetDetail, centerAssetPermissionName } = await getCenterPermissionData({
      assetId,
      centerId,
      ctx,
    }));
  }

  await ctx.tx.call('users.permissions.addItem', {
    item: assetDetail.id,
    type: ctx.prefixPN('asset.can-administer'),
    data: {
      permissionName: centerAssetPermissionName,
      actionNames: ['admin'],
      target: assetDetail.category,
    },
    isCustomPermission: true,
  });
  return true;
}

module.exports = { addCenterItemPermission };
