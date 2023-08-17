async function setPreferences({ user, values, ctx }) {
  return ctx.tx.db.UserPreferences.findOneAndUpdate(
    { user },
    {
      user,
      ...values,
    },
    { upsert: true }
  );
}

module.exports = { setPreferences };
