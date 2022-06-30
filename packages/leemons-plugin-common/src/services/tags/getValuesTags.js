const _ = require('lodash');
const { table } = require('../tables');

async function getValuesTags(values, { type, transacting }) {
  let _values = _.isArray(values) ? values : [values];
  _values = _.map(_values, (value) => JSON.stringify(value));
  // Check if value not empty
  if (_values.length === 0) {
    return [];
    // throw new Error(`Values cannot be empty.`);
  }

  const query = { value_$in: _values };
  if (type) {
    query.type = type;
  }

  const tags = await table.tags.find(query, { transacting });

  const tagsByValue = _.groupBy(tags, 'value');

  return _.map(_values, (value) => (tagsByValue[value] ? _.map(tagsByValue[value], 'tag') : []));
}

module.exports = { getValuesTags };
