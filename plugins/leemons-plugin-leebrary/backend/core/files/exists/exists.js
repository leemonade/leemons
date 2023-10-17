/**
 * Check if a file exists in the database
 *
 * @param {object} params - The params object
 * @param {string} params.fileId - The ID of the file to check
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} - Returns true if the file exists, false otherwise
 */
async function exists({ fileId, ctx }) {
  const count = await ctx.tx.db.Files.countDocuments({ id: fileId });
  return count > 0;
}

module.exports = { exists };
