async function setContactPhone({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-contact-phone' },
    {
      key: 'platform-contact-phone',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setContactPhone;
