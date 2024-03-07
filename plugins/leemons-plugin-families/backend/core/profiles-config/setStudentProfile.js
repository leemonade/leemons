/**
 * It says that the platform profile corresponds to a student
 * @public
 * @static
 * @param {string} profile - Profile id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setStudentProfile({ profile, ctx }) {
  return ctx.tx.db.ProfilesConfig.findOneAndUpdate(
    { type: 'student' },
    {
      type: 'student',
      profile,
    },
    { upsert: true, new: true, lean: true }
  );
}

module.exports = { setStudentProfile };
