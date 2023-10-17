async function setEmailWidthLogo({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-email-width-logo' },
    {
      key: 'platform-email-width-logo',
      value,
    },
    {
      lean: true,
      new: true,
      upsert: true,
    }
  );
}

module.exports = setEmailWidthLogo;
