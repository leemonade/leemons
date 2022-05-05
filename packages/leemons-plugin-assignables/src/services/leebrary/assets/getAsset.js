const leebrary = require('../leebrary');

module.exports = async function getAsset(assetId, { userSession, withFiles, transacting } = {}) {
  const [asset] = await leebrary().assets.getByIds([assetId], {
    withFiles,
    userSession,
    transacting,
  });

  return asset;
};
