const { isArray, isEmpty } = require('lodash');
const { tables } = require('../tables');
const { parseMetadata } = require('./helpers/parseMetadata');

/**
 * Fetches files by their IDs.
 * @param {Array|string} fileIds - The file IDs.
 * @param {Object} options - The options object.
 * @param {string} options.type - The type of the files.
 * @param {Array} options.columns - The columns to be returned.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The files objects.
 */
async function getByIds(fileIds, { type, columns, transacting } = {}) {
  const ids = isArray(fileIds) ? fileIds : [fileIds];
  const query = {
    id_$in: ids,
  };

  if (type && !isEmpty(type)) {
    query.type_$contains = type;
  }

  const items = await tables.files.find(query, { columns, transacting });
  return items.map(parseMetadata);
}

module.exports = { getByIds };
