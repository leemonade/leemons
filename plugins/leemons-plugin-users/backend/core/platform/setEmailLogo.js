async function setEmailLogo({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-email-logo' },
    {
      key: 'platform-email-logo',
      value,
    },
    {
      lean: true,
      new: true,
      upsert: true,
    }
  );
}

module.exports = setEmailLogo;
