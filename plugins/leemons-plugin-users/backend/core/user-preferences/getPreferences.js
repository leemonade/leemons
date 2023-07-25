async function getPreferences({ user, ctx }) {
  return ctx.tx.db.UserPreferences.findOne({ user }).lean();
}

module.exports = { getPreferences };
