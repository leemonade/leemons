/**
 * Returns which platform profile corresponds to student
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getStudentProfile({ ctx }) {
  const response = await ctx.tx.db.ProfilesConfig.findOne({ type: 'student' }).lean();
  if (response) return response.profile;
  return null;
}

module.exports = { getStudentProfile };
