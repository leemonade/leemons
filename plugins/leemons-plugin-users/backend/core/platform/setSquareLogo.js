async function setSquareLogo({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-square-logo' },
    {
      key: 'platform-square-logo',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setSquareLogo;
