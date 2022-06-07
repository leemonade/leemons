const { isNil } = require('lodash');
const updateAsset = require('./updateAsset');

const leebrary = require('../leebrary');

module.exports = async function duplicateAsset(
  assetId,
  { preserveName, public: isPublic, indexable, userSession, transacting } = {}
) {
  let asset = await leebrary().assets.duplicate(assetId, {
    preserveName,
    userSession,
    transacting,
  });

  if (!isNil(isPublic) || !isNil(indexable)) {
    asset = await updateAsset(
      {
        id: asset.id,
        name: asset.name,
        category: asset.category,
        public: isPublic,
        indexable,
        coverFile: asset?.cover?.id,
      },
      { upgrade: false, userSession, transacting }
    );
  }

  return asset;
};
