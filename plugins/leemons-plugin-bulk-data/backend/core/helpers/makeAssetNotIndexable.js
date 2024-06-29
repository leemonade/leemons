async function makeAssetNotIndexable({ creator, assetId, assetName, ctx }) {
  if (assetId && assetName) {
    await ctx.call(
      'leebrary.assets.update',
      {
        data: { id: assetId, name: assetName, indexable: false },
      },
      { meta: { userSession: { ...creator } } }
    );
  }
}

module.exports = { makeAssetNotIndexable };
