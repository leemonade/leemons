async function getAppearanceMainColor({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-appearance-main-color' }).lean();
  return config ? config.value : '#3B76CC';
}

module.exports = getAppearanceMainColor;
