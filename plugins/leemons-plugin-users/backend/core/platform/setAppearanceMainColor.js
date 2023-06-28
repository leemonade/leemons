async function setAppearanceMainColor({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-appearance-main-color' },
    {
      key: 'platform-appearance-main-color',
      value,
    },
    { upsert: true }
  );
}

module.exports = setAppearanceMainColor;
