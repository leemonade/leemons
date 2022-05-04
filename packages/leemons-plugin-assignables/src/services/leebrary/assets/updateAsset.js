const leebrary = require('../leebrary');

module.exports = async function updateAsset(
  asset,
  { upgrade = true, scale = 'major', published = true, userSession, transacting }
) {
  return leebrary().assets.update(asset, { upgrade, scale, published, userSession, transacting });
};
