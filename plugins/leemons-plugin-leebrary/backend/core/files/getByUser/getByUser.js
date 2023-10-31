/**
 * Get files by user
 *
 * @param {string} userId - The user ID.
 * @param {Object} options - The options object.
 * @param {MoleculerContext} options.ctx - The molecuer context.
 * @returns {Promise<Array>} The array of files.
 */
async function getByUser({ userId, ctx }) {
  // ! Model has no fromUser field.
  const results = await ctx.tx.db.Files.find({ fromUser: userId }).lean();
  return results.map((item) => {
    const data = { ...item };
    if (data.metadata) data.metadata = JSON.parse(data.metadata || null);
    return data;
  });
}

module.exports = { getByUser };
