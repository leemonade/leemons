async function updateAsset({ asset, upgrade = true, scale = 'major', published = true, ctx }) {
  const _asset = { ...asset, subjects: asset.subjects?.map((subject) => subject.subject) };
  return ctx.tx.call('leebrary.assets.update', { data: _asset, upgrade, scale, published });
}

module.exports = { updateAsset };
