async function removeBlock({ id, soft, ctx }) {
  await ctx.tx.db.Blocks.deleteOne({ id }, { soft });

  return true;
}

module.exports = { removeBlock };
