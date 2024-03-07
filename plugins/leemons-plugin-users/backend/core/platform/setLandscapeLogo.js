async function setLandscapeLogo({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-landscape-logo' },
    {
      key: 'platform-landscape-logo',
      value,
    },
    {
      lean: true,
      new: true,
      upsert: true,
    }
  );
}

module.exports = setLandscapeLogo;
