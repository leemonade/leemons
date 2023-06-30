async function existMany({ _ids, ctx }) {
  const response = await ctx.tx.db.Profiles.countDocuments({ _id: _ids });
  return response === _ids.length;
}

module.exports = { existMany };
