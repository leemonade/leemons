async function setContactName({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-contact-name' },
    {
      key: 'platform-contact-name',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setContactName;
