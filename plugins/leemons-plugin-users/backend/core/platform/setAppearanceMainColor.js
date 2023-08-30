async function setAppearanceMainColor({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-appearance-main-color' },
    {
      key: 'platform-appearance-main-color',
      value,
    },
    { new: true, lean: true, upsert: true }
  );
}

module.exports = setAppearanceMainColor;
