const _ = require('lodash');
const { table } = require('../tables');
const { validatePrefix } = require('../../validation/validate');

async function update(key, { name, description, transacting } = {}) {
  validatePrefix(key, this.calledFrom);
  const toUpdate = {};
  if (!_.isUndefined(name)) toUpdate.name = name;
  if (!_.isUndefined(description)) toUpdate.description = description;
  return table.widgetZone.update({ key }, toUpdate, { transacting });
}

module.exports = { update };
