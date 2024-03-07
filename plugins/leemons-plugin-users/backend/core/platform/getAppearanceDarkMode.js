async function getAppearanceDarkMode({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-appearance-dark-mode' }).lean();
  return Boolean(config?.value);
}

module.exports = getAppearanceDarkMode;
