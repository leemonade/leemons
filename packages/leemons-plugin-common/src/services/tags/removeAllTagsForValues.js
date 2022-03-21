const _ = require('lodash');
const { table } = require('../tables');
const { validateTypePrefix } = require('../../validation/validate');

async function removeAllTagsForValues(type, values, { transacting }) {
  validateTypePrefix(type, this.calledFrom);
  let _values = _.isArray(values) ? values : [values];
  _values = _.map(_values, (value) => JSON.stringify(value));
  // Check if value not empty
  if (_values.length === 0) {
    throw new Error(`Values cannot be empty.`);
  }

  return table.tags.deleteMany({ type, value_$in: _values }, { transacting });
}

module.exports = { removeAllTagsForValues };
