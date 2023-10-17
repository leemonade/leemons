async function setContactEmail({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-contact-email' },
    {
      key: 'platform-contact-email',
      value,
    },
    {
      lean: true,
      new: true,
      upsert: true,
    }
  );
}

module.exports = setContactEmail;
