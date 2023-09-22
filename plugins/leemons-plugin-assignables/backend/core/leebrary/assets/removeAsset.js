async function removeAsset({ id, ctx }) {
  return ctx.tx.call('leebrary.assets.remove', { id, soft: false });
}

module.exports = { removeAsset };
