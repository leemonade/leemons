async function setPicturesEmptyStates({ value, ctx }) {
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-pictures-empty-states' },
    {
      key: 'platform-pictures-empty-states',
      value,
    },
    {
      new: true,
      lean: true,
      upsert: true,
    }
  );
}

module.exports = setPicturesEmptyStates;
