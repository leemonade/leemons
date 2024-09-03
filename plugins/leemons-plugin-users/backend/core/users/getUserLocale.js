module.exports = async function getUserLocale({ email, ctx }) {
  const user = await ctx.tx.db.Users.findOne({ email }).select({ locale: 1, _id: 0 });

  return user?.locale;
};
