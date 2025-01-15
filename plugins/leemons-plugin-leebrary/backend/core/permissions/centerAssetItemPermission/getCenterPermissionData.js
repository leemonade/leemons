const { CENTER_ASSETS_PERMISSION_PREFIX } = require('@leemons/users');

const { getByIds } = require('../../assets/getByIds');

const getCenterPermissionName = ({ centerId }) => `${CENTER_ASSETS_PERMISSION_PREFIX}.${centerId}`;

const getCenterPermissionData = async ({ assetId, centerId, ctx }) => {
  const [assetDetail] = await getByIds({ ids: [assetId], ctx });
  const centerAssetPermissionName = getCenterPermissionName({ centerId });

  return { assetDetail, centerAssetPermissionName };
};

module.exports = { getCenterPermissionData, getCenterPermissionName };
