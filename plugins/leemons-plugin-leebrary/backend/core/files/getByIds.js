const { isArray, isEmpty } = require('lodash');
const { tables } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getByIds(fileIds, { type, columns, transacting } = {}) {
  const ids = isArray(fileIds) ? fileIds : [fileIds];
  const query = {
    id_$in: ids,
  };

  if (type && !isEmpty(type)) {
    query.type_$contains = type;
  }

  const items = await tables.files.find(query, { columns, transacting });
  const data = items.map((item) => {
    const file = { ...item };
    if (file.metadata) file.metadata = JSON.parse(file.metadata);
    return file;
  });

  return data;
}

module.exports = { getByIds };
