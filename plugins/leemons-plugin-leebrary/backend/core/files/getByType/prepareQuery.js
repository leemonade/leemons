const { isArray, isEmpty } = require('lodash');
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
    query.id = ids;
  }

  if (type && !isEmpty(type)) {
    const regexStr = type === 'document' ? 'application' : type;
    query.type = { $regex: regexStr, $options: 'i' };
  }

  return query;
}
module.exports = { prepareQuery };
