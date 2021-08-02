const { table } = require('../tables');

async function exist(id, { transacting } = {}) {
  const response = await table.roles.count({ id }, { transacting });
  return !!response;
}

module.exports = exist;
