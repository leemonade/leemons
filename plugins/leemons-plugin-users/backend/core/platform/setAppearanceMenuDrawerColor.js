async function setAppearanceMenuDrawerColor({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-appearance-menu-drawer-color' },
    {
      key: 'platform-appearance-menu-drawer-color',
      value,
    },
    {
      lean: true,
      new: true,
      upsert: true,
    }
  );
}

module.exports = setAppearanceMenuDrawerColor;
