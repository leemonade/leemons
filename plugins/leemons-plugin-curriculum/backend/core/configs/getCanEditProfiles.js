async function getCanEditProfiles({ ctx }) {
  const result = await ctx.tx.db.Configs.findOne({ key: 'can-edit-profiles' }).lean();
  return result ? JSON.parse(result.value) : [];
}

module.exports = { getCanEditProfiles };
