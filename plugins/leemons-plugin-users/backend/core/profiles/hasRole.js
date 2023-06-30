async function hasRole({ profileId, roleId, ctx }) {
  const response = await ctx.tx.db.ProfileRole.countDocuments({ profile: profileId, role: roleId });
  return !!response;
}

module.exports = { hasRole };
