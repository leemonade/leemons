async function setAppearanceMenuDrawerColor({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-appearance-menu-drawer-color' },
    {
      key: 'platform-appearance-menu-drawer-color',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setAppearanceMenuDrawerColor;
