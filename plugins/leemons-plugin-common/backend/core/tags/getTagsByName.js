const _ = require('lodash');

async function getTagsByName({ name, type, ctx }) {
  const query = { tag: { $regex: _.escapeRegExp(name), $options: 'i' } };
  if (type) {
    query.type = type;
  }
  const tags = await ctx.tx.db.Tags.find(query).select(['tag']).lean();
  return _.map(tags, 'tag');
}

module.exports = { getTagsByName };
