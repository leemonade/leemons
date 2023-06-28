async function setContactEmail({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-contact-email' },
    {
      key: 'platform-contact-email',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setContactEmail;
