async function setAppearanceDarkMode({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-appearance-dark-mode' },
    {
      key: 'platform-appearance-dark-mode',
      value,
    },
    {
      new: true,
      lean: true,
      upsert: true,
    }
  );
}

module.exports = setAppearanceDarkMode;
