async function setAppearanceMenuMainColor({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-appearance-menu-main-color' },
    {
      key: 'platform-appearance-menu-main-color',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setAppearanceMenuMainColor;
