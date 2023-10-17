async function get({ userAgent, ctx }) {
  const config = await ctx.tx.db.UserAgentConfig.findOne({ userAgent }).lean();
  return {
    muted: config?.muted ? !!config.muted : false,
  };
}

module.exports = { get };
