async function getRoleProfile({ roleId, ctx }) {
  const profileRole = await ctx.tx.db.ProfileRole.findOne({ role: roleId })
    .select(['profile'])
    .lean();
  if (profileRole) return profileRole.profile;
  return null;
}

module.exports = { getRoleProfile };
