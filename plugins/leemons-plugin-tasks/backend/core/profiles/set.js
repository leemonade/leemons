module.exports = async function set({ key, profile, ctx }) {
  await ctx.tx.db.Profiles.updateOne({ key }, { profile });

  return true;
};
