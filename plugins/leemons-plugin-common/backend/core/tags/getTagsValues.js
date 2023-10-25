const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function getTagsValues({ tags, type, ctx }) {
  const _tags = _.isArray(tags) ? tags : [tags];
  // Check if value is not empty
  if (_tags.length === 0) {
    throw new LeemonsError(ctx, { message: 'Tags cannot be empty.' });
  }

  const query = { tag: _tags };
  if (type) {
    query.type = type;
  }

  const values = await ctx.tx.db.Tags.find(query).lean();

  const valuesByTag = _.groupBy(values, 'tag');

  return _.map(_tags, (value) =>
    valuesByTag[value] ? _.map(valuesByTag[value], (v) => JSON.parse(v.value || null)) : []
  );
}

module.exports = { getTagsValues };
