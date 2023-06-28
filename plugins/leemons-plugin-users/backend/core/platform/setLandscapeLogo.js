async function setLandscapeLogo({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-landscape-logo' },
    {
      key: 'platform-landscape-logo',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setLandscapeLogo;
