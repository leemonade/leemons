/**
 * It says that the platform profile corresponds to a guardian
 * @public
 * @static
 * @param {string} profile - Profile id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setGuardianProfile({ profile, ctx }) {
  return ctx.tx.db.ProfilesConfig.findOneAndUpdate(
    { type: 'guardian' },
    {
      type: 'guardian',
      profile,
    },
    { upsert: true, new: true, lean: true }
  );
}

module.exports = { setGuardianProfile };
