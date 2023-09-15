/**
 * Retrieves a file by its ID from the database.
 *
 * @async
 * @function getById
 * @param {Object} options - Input options.
 * @param {string} options.id - The ID of the file to retrieve.
 * @param {MoleculerContext} options.ctx - The Moleculer context.
 * @returns {Promise<Object|null>} The file data object or null if not found.
 */
async function getById({ id, ctx }) {
  const item = await ctx.tx.db.Files.findOne({ id }).lean();
  if (!item) {
    return null;
  }
  const data = { ...item };
  if (data.metadata) data.metadata = JSON.parse(data.metadata);
  return data;
}

module.exports = { getById };
