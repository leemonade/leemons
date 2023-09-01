async function getGeneral({ ctx }) {
  const item = await ctx.tx.db.Config.findOne({ type: 'general' }).lean();
  let config = {
    enabled: true,
  };
  if (item) {
    config = JSON.parse(item.config);
  }
  return config;
}

module.exports = { getGeneral };
