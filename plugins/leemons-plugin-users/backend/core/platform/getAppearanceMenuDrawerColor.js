async function getAppearanceMenuDrawerColor({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({
    key: 'platform-appearance-menu-drawer-color',
  }).lean();
  return config ? config.value : '#333F56';
}

module.exports = getAppearanceMenuDrawerColor;
