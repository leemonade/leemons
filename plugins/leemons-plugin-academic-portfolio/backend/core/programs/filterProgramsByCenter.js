/**
 * Filters programs by center ID.
 *
 * @async
 * @function filterProgramsByCenter
 * @param {Object} params - The function parameters.
 * @param {Array.<string>} params.programIds - Array of program IDs to filter.
 * @param {string} params.centerId - The center ID to filter the programs by.
 * @param {Object} params.ctx - The context object containing the database connection.
 * @returns {Promise<Array.<string>>} - A promise that resolves to an array of program IDs.
 */
async function filterProgramsByCenter({ programIds, centerId, ctx }) {
  const filteredPrograms = await ctx.tx.db.ProgramCenter.find({
    program: programIds,
    center: centerId,
  }).lean();

  return filteredPrograms.map((fp) => fp.program);
}

module.exports = { filterProgramsByCenter };
