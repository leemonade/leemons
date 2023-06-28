async function getLandscapeLogo({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-landscape-logo' }).lean();
  return config ? config.value : null;
}

module.exports = getLandscapeLogo;
