const leebrary = require('../leebrary');

module.exports = async function getAsset(assetId, { preserveName, userSession, transacting } = {}) {
  const asset = await leebrary().assets.duplicate(assetId, {
    preserveName,
    userSession,
    transacting,
  });

  return asset;
};
