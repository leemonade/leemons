async function setSquareLogo({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-square-logo' },
    {
      key: 'platform-square-logo',
      value,
    },
    {
      new: true,
      lean: true,
      upsert: true,
    }
  );
}

module.exports = setSquareLogo;
