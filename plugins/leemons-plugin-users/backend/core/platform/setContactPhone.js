async function setContactPhone({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-contact-phone' },
    {
      key: 'platform-contact-phone',
      value,
    },
    {
      new: true,
      lean: true,
      upsert: true,
    }
  );
}

module.exports = setContactPhone;
