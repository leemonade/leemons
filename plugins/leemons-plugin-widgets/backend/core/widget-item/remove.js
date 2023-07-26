const { table } = require('../tables');
const { validatePrefix } = require('../../validation/validate');

async function remove(zoneKey, key, { transacting } = {}) {
  validatePrefix(key, this.calledFrom);
  return table.widgetItem.delete({ zoneKey, key }, { transacting });
}

module.exports = { remove };
