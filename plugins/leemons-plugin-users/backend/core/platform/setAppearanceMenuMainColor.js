async function setAppearanceMenuMainColor({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-appearance-menu-main-color' },
    {
      key: 'platform-appearance-menu-main-color',
      value,
    },
    { lean: true, new: true, upsert: true }
  );
}

module.exports = setAppearanceMenuMainColor;
