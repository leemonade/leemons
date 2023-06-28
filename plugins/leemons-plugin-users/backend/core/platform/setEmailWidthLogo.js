async function setEmailWidthLogo({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-email-width-logo' },
    {
      key: 'platform-email-width-logo',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setEmailWidthLogo;
