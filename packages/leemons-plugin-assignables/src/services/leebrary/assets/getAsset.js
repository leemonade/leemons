const leebrary = require('../leebrary');

module.exports = async function getAsset(
  assetId,
  { userSession, withFiles, checkPermissions, transacting } = {}
) {
  const asset = await leebrary().assets.getByIds(Array.isArray(assetId) ? assetId : [assetId], {
    withFiles,
    checkPermissions,
    userSession,
    transacting,
  });

  return Array.isArray(assetId) ? asset : asset[0];
};
