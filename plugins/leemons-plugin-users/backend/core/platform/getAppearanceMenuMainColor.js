async function getAppearanceMenuMainColor({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({
    key: 'platform-appearance-menu-main-color',
  }).lean();
  return config ? config.value : '#212B3D';
}

module.exports = getAppearanceMenuMainColor;
