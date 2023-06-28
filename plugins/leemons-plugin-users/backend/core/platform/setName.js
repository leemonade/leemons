async function setName({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-name' },
    {
      key: 'platform-name',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setName;
