const { table } = require('../tables');

async function exists(key, { transacting } = {}) {
  const count = await table.widgetZone.count({ key }, { transacting });
  return !!count;
}

module.exports = { exists };
