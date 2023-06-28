async function setPicturesEmptyStates({ value, ctx }) {
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-pictures-empty-states' },
    {
      key: 'platform-pictures-empty-states',
      value,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setPicturesEmptyStates;
