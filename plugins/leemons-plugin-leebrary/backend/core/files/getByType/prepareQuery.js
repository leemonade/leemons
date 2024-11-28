const { isArray, isEmpty, escapeRegExp } = require('lodash');
/**
 * Prepare the query object based on the provided parameters.
 *
 * @param {string|array} type - The file type or list of file types to filter by
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
    if (type?.includes(',')) {
      const typesArray = type.split(',');

      const patterns = typesArray.map((t) => {
        const regexStr = t === 'document' ? 'application' : escapeRegExp(t);
        return new RegExp(regexStr, 'i');
      });
      query.type = { $in: patterns };
    } else {
      const regexStr = type === 'document' ? 'application' : escapeRegExp(type);
      query.type = { $regex: regexStr, $options: 'i' };
    }
  }

  return query;
}
module.exports = { prepareQuery };
