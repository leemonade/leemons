async function setName({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-name' },
    {
      key: 'platform-name',
      value,
    },
    {
      lean: true,
      new: true,
      upsert: true,
    }
  );
}

module.exports = setName;
