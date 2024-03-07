async function getEmailLogo({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-email-logo' }).lean();
  return config ? config.value : null;
}

module.exports = getEmailLogo;
