const _ = require('lodash');
const { table } = require('../tables');
const { validateTypePrefix } = require('../../validation/validate');

async function removeTagsForValues(type, tags, values, { transacting }) {
  validateTypePrefix(type, this.calledFrom);
  const _tags = _.isArray(tags) ? tags : [tags];
  let _values = _.isArray(values) ? values : [values];
  _values = _.map(_values, (value) => JSON.stringify(value));
  // Check if tag not empty
  if (_tags.length === 0) {
    throw new Error(`Tags cannot be empty.`);
  }
  // Check if value not empty
  if (_values.length === 0) {
    throw new Error(`Values cannot be empty.`);
  }

  return table.tags.deleteMany({ type, tag_$in: _tags, value_$in: _values }, { transacting });
}

module.exports = { removeTagsForValues };
