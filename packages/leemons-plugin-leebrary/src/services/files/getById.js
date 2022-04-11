const { tables } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getById(id, { transacting } = {}) {
  const item = await tables.files.findOne({ id }, { transacting });
  const data = { ...item };
  if (data.metadata) data.metadata = JSON.parse(data.metadata);
  return data;
}

module.exports = { getById };
