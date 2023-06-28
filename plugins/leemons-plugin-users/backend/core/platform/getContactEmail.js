async function getContactEmail({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-contact-email' }).lean();
  return config ? config.value : null;
}

module.exports = getContactEmail;
