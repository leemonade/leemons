const leebrary = require('../leebrary');

module.exports = async function getAsset(assetId, { userSession, transacting } = {}) {
  const [asset] = await leebrary().assets.getByIds([assetId], { userSession, transacting });

  return asset;
};
