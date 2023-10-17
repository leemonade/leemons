async function setContactName({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-contact-name' },
    {
      key: 'platform-contact-name',
      value,
    },
    { new: true, lean: true, upsert: true }
  );
}

module.exports = setContactName;
