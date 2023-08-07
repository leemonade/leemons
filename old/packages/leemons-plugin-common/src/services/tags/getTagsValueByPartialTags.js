const { isArray, map, uniq } = require('lodash');
const { table } = require('../tables');

async function getTagsValueByPartialTags(values, { type, transacting } = {}) {
  const _values = isArray(values) ? values : [values];

  // EN: Check if value is not empty
  // ES: Comprobar si los valores no están vacíos
  if (_values.length === 0) {
    throw new Error(`tags cannot be empty.`);
  }

  const query = { $or: _values.map((value) => ({ tag_$contains: value })) };

  if (type) {
    query.type = type;
  }

  const valuesFound = await table.tags.find(query, { columns: ['value'], transacting });

  const tagsValues = uniq(map(valuesFound, ({ value }) => JSON.parse(value)));

  return tagsValues;
}

module.exports = { getTagsValueByPartialTags };
