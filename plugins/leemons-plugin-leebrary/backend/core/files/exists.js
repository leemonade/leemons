async function exists({ fileId, ctx }) {
  const count = await ctx.tx.db.Files.countDocuments({ id: fileId });
  return count > 0;
}

module.exports = { exists };
