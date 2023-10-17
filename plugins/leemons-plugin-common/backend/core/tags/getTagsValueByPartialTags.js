const { escapeRegExp, isArray, map, uniq } = require('lodash');

const LeemonsError = require('@leemons/error');

async function getTagsValueByPartialTags({ values, type, ctx }) {
  const _values = isArray(values) ? values : [values];

  // EN: Check if value is not empty
  // ES: Comprobar si los valores no están vacíos
  if (_values.length === 0) {
    throw new LeemonsError(ctx, { message: 'Values cannot be empty.' });
  }

  const query = { $or: _values.map((value) => ({ tag: { $regex: escapeRegExp(value) } })) };

  if (type) {
    query.type = type;
  }

  const valuesFound = await ctx.tx.db.Tags.find(query).select(['value']).lean();

  return uniq(map(valuesFound, ({ value }) => JSON.parse(value)));
}

module.exports = { getTagsValueByPartialTags };
