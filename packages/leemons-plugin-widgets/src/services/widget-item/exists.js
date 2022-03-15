const { table } = require('../tables');

async function exists(zoneKey, key, { transacting } = {}) {
  const count = await table.widgetZone.count({ zoneKey, key }, { transacting });
  return !!count;
}

module.exports = { exists };
