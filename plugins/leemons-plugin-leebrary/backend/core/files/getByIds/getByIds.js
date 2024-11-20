const { isEmpty, escapeRegExp } = require('lodash');

const { normalizeItemsArray } = require('../../shared');
const { parseMetadata } = require('../helpers/parseMetadata');

/**
 * Fetches and returns files from the database using provided file IDs.
 *
 * @param {Object} params - An object containing optional parameters
 * @param {Array|string} params.fileIds - An array of file IDs or a single file ID
 * @param {string} params.type - The type of the files to fetch
 * @param {boolean} params.parsed - Flag indicating if metadata needs to be parsed
 * @param {Array} params.columns - The columns to fetch from the database
 * @param {MoleculerContext} params.ctx - The moleculer context
 * @returns {Promise<Array>} An array of the fetched files
 */
async function getByIds({ fileIds, type, parsed = true, columns, ctx }) {
  const ids = normalizeItemsArray(fileIds);

  const query = {
    id: ids,
  };

  if (type && !isEmpty(type)) {
    query.type = { $regex: escapeRegExp(type), $options: 'i' };
  }

  const items = await ctx.tx.db.Files.find(query).select(columns).lean();

  if (!parsed) {
    return items;
  }

  return items.map(parseMetadata);
}

module.exports = { getByIds };
