const { table } = require('../tables');

async function query(q, { transacting } = {}) {
  return table.config.find(q, { transacting });
}

module.exports = query;
