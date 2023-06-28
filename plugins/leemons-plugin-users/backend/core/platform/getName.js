async function getName({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-name' }).lean();
  return config ? config.value : null;
}

module.exports = getName;
