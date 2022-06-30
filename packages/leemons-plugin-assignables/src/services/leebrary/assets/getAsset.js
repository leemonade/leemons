const leebrary = require('../leebrary');

module.exports = async function getAsset(assetId, { userSession, withFiles, transacting } = {}) {
  const asset = await leebrary().assets.getByIds(Array.isArray(assetId) ? assetId : [assetId], {
    withFiles,
    userSession,
    transacting,
  });

  return Array.isArray(assetId) ? asset : asset[0];
};
