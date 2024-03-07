async function getContactPhone({ ctx }) {
  const config = await ctx.tx.db.Config.findOne({ key: 'platform-contact-phone' }).lean();
  return config ? config.value : null;
}

module.exports = getContactPhone;
