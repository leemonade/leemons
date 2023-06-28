async function getEmailWidthLogo({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-email-width-logo' }).lean();
  return config ? config.value : null;
}

module.exports = getEmailWidthLogo;
