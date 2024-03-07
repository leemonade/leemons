module.exports = async function get({ key, ctx }) {
  const profile = await ctx.tx.db.Profiles.findOne({ key }).lean();

  if (!profile) {
    const p = await ctx.tx.call('academic-portfolio.settings.getProfiles');
    return p[key];
  }

  return profile.profile;
};
