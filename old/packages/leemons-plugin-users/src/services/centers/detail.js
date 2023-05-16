const { table } = require('../tables');

async function detail(id, { transacting } = {}) {
  return table.centers.findOne({ id }, { transacting });
}

module.exports = detail;
