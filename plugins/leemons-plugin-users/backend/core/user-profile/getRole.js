async function getRole({ user, profile, ctx }) {
  const userProfile = await ctx.tx.db.UserProfile.findOne({ user, profile })
    .select(['role'])
    .lean();
  if (userProfile) return userProfile.role;
  return null;
}

module.exports = { getRole };
