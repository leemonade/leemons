const { table } = require('../tables');
const { validatePrefix } = require('../../validation/validate');

async function add(key, { name, description, transacting } = {}) {
  validatePrefix(key, this.calledFrom);
  return table.widgetZone.create({ key, name, description }, { transacting });
}

module.exports = { add };
