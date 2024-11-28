const { parseMetadata } = require('../helpers/parseMetadata');

const { prepareQuery } = require('./prepareQuery');

/**
 * Get files by type.
 *
 * @param {Object} params - The options for the query.
 * @param {string|array} params.type - The file type or list of file types to filter by
 * @param {Array|Object} params.files - The files to be queried.
 * @param {Array} params.columns - The columns to be returned in the result.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<Array>} The queried files with parsed metadata.
 */
async function getByType({ type, files, columns, ctx }) {
  if (!files.length) return [];
  const query = prepareQuery(type, files);
  const items = await ctx.tx.db.Files.find(query).select(columns).lean();
  return items.map(parseMetadata);
}

module.exports = { getByType };
