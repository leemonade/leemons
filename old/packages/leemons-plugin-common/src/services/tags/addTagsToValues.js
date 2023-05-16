const _ = require('lodash');
const { table } = require('../tables');
const { validateTypePrefix } = require('../../validation/validate');

async function addTagsToValues(type, tags, values, { transacting }) {
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

  const promises = [];

  _.forEach(_tags, (tag) => {
    _.forEach(_values, (value) => {
      promises.push(table.tags.create({ type, tag, value }, { transacting }));
    });
  });

  return Promise.all(promises);
}

module.exports = { addTagsToValues };
