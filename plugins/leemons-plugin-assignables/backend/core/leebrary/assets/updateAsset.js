async function updateAsset({ asset, upgrade = true, scale = 'major', published = true, ctx }) {
  return ctx.tx.call('leebrary.assets.update', { data: asset, upgrade, scale, published });
}

module.exports = { updateAsset };
