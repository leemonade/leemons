const { table } = require('../tables');

async function existMany(ids, { transacting } = {}) {
  const response = await table.profiles.count({ id_$in: ids }, { transacting });
  return response === ids.length;
}

module.exports = { existMany };
