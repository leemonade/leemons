const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { normalizeItemsArray } = require('../shared');

/**
 * Fetches and returns files from the database using provided file IDs.
 *
 * @param {Array|string} fileIds - An array of file IDs or a single file ID
 * @param {Object} params - An object containing optional parameters
 * @param {string} params.type - The type of the files to fetch
 * @param {boolean} params.parsed - Flag indicating if metadata needs to be parsed
 * @param {Array} params.columns - The columns to fetch from the database
 * @param {Object} params.transacting - The transaction object
 * @returns {Promise<Array>} An array of the fetched files
 */
async function getByIds(fileIds, { type, parsed = true, columns, transacting } = {}) {
  const ids = normalizeItemsArray(fileIds);

  const query = {
    id_$in: ids,
  };

  if (type && !isEmpty(type)) {
    query.type_$contains = type;
  }

  const items = await tables.files.find(query, { columns, transacting });

  if (!parsed) {
    return items;
  }

  const parsedItems = items.map((item) => {
    const file = { ...item };
    if (file.metadata) {
      file.metadata = JSON.parse(file.metadata);
    }
    return file;
  });

  return parsedItems;
}

module.exports = { getByIds };
