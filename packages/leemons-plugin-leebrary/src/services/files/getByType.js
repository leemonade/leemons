const { isArray, isEmpty } = require('lodash');
const { tables } = require('../tables');
const { parseMetadata } = require('./helpers/parseMetadata');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Prepare the query object based on the provided parameters.
 * 
 * @param {string} type - The type of the file.
 * @param {Array|Object} files - The files to be queried.
 * @returns {Object} The prepared query object.
 */
function prepareQuery(type, files) {
  const query = {};

  if (files && !isEmpty(files)) {
    const ids = isArray(files) ? files : [files];
    query.id_$in = ids;
  }

  if (type && !isEmpty(type)) {
    query.type_$contains = type === 'document' ? 'application' : type;
  }

  return query;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Get files by type.
 * 
 * @param {string} type - The type of the file.
 * @param {Object} options - The options for the query.
 * @param {Array|Object} options.files - The files to be queried.
 * @param {Array} options.columns - The columns to be returned in the result.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The queried files.
 */
async function getByType(type, { files, columns, transacting } = {}) {
  const query = prepareQuery(type, files);
  const items = await tables.files.find(query, { columns, transacting });
  return items.map(parseMetadata);
}

module.exports = { getByType };
