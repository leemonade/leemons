const { isNil } = require('lodash');
const { updateAsset } = require('./updateAsset');

async function duplicateAsset({ id, preserveName, public: isPublic, indexable, ctx }) {
  let asset = await ctx.tx.call('leebrary.assets.duplicate', { id, preserveName });

  if (!isNil(isPublic) || !isNil(indexable)) {
    asset = await updateAsset({
      asset: {
        id: asset.id,
        name: asset.name,
        category: asset.category,
        public: isPublic,
        indexable,
        coverFile: asset?.cover?.id,
      },
      upgrade: false,

      ctx,
    });
  }

  return asset;
}

module.exports = { duplicateAsset };
