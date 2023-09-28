const { parseMetadata } = require('../helpers/parseMetadata');
const { prepareQuery } = require('./prepareQuery');

/**
 * Get files by type.
 *
 * @param {Object} params - The options for the query.
 * @param {string} params.type - The type of the file.
 * @param {Array|Object} params.files - The files to be queried.
 * @param {Array} params.columns - The columns to be returned in the result.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<Array>} The queried files with parsed metadata.
 */
async function getByType({ type, files, columns, ctx }) {
  const query = prepareQuery(type, files);
  const items = await ctx.tx.db.Files.find(query).select(columns).lean();
  return items.map(parseMetadata);
}

module.exports = { getByType };
