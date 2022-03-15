const { table } = require('../tables');

async function get(key, { transacting } = {}) {
  const [zone, items] = await Promise.all([
    table.widgetZone.findOne({ key }, { transacting }),
    table.widgetItem.find({ zoneKey: key }, { transacting }),
  ]);
  return { ...zone, widgetItems: items };
}

module.exports = { get };
