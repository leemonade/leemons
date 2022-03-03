const _ = require('lodash');
const { table } = require('../tables');
const { validateTypePrefix } = require('../../validation/validate');

async function removeAllValuesForTags(type, tags, { transacting }) {
  validateTypePrefix(type, this.calledFrom);
  const _tags = _.isArray(tags) ? tags : [tags];
  // Check if tag not empty
  if (_tags.length === 0) {
    throw new Error(`Tags cannot be empty.`);
  }

  return table.tags.deleteMany({ type, tag_$in: _tags }, { transacting });
}

module.exports = { removeAllValuesForTags };
