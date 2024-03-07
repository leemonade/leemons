async function getSquareLogo({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-square-logo' }).lean();
  return config ? config.value : null;
}

module.exports = getSquareLogo;
