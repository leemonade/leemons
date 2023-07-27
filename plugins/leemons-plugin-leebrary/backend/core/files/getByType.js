const { isArray, isEmpty } = require('lodash');
const { tables } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getByType(type, { files, columns, transacting } = {}) {
  const query = {};

  if (files && !isEmpty(files)) {
    const ids = isArray(files) ? files : [files];
    query.id_$in = ids;
  }

  if (type && !isEmpty(type)) {
    query.type_$contains = type === 'document' ? 'application' : type;
  }

  const items = await tables.files.find(query, { columns, transacting });
  const data = items.map((item) => {
    const file = { ...item };
    if (file.metadata) file.metadata = JSON.parse(file.metadata);
    return file;
  });

  return data;
}

module.exports = { getByType };
