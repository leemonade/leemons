/**
 * Returns which platform profile corresponds to guardian
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getGuardianProfile({ ctx }) {
  const response = await ctx.tx.db.ProfilesConfig.findOne({ type: 'guardian' }).lean();
  if (response) return response.profile;
  return null;
}

module.exports = { getGuardianProfile };
