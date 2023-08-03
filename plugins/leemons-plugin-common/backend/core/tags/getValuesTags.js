const _ = require('lodash');

async function getValuesTags({ type, values, ctx }) {
  let _values = _.isArray(values) ? values : [values];
  _values = _.map(_values, (value) => JSON.stringify(value));
  // Check if values is not empty
  if (_values.length === 0) {
    return [];
    // throw new Error(`Values cannot be empty.`);
  }

  const query = { value: _values };
  if (type) {
    query.type = type;
  }

  const tags = await ctx.tx.db.Tags.find(query).lean();

  const tagsByValue = _.groupBy(tags, 'value');

  return _.map(_values, (value) => (tagsByValue[value] ? _.map(tagsByValue[value], 'tag') : []));
}

module.exports = { getValuesTags };
