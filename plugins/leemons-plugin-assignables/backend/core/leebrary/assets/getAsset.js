async function getAsset({ id, withFiles, checkPermissions, ctx }) {
  const ids = Array.isArray(id) ? id : [id];

  const asset = await ctx.tx.call('leebrary.assets.getByIds', {
    ids,
    withFiles,
    checkPermissions,
  });

  return Array.isArray(id) ? asset : asset[0];
}

module.exports = { getAsset };
