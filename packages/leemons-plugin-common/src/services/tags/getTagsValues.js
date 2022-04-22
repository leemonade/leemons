const _ = require('lodash');
const { table } = require('../tables');

async function getTagsValues(tags, { type, transacting }) {
  const _tags = _.isArray(tags) ? tags : [tags];
  // Check if value not empty
  if (_tags.length === 0) {
    throw new Error(`tags cannot be empty.`);
  }

  const query = { tag_$in: _tags };
  if (type) {
    query.type = type;
  }

  const values = await table.tags.find(query, { transacting });

  const valuesByTag = _.groupBy(values, 'tag');

  const result = _.map(_tags, (value) =>
    valuesByTag[value] ? _.map(valuesByTag[value], (v) => JSON.parse(v.value)) : []
  );

  return result;
}

module.exports = { getTagsValues };
