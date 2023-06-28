async function setAppearanceDarkMode({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-appearance-dark-mode' },
    {
      key: 'platform-appearance-dark-mode',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setAppearanceDarkMode;
