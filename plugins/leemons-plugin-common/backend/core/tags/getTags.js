const _ = require('lodash');

async function getTags({ type, ctx }) {
  const query = {};
  if (type) {
    query.type = type;
  }
  const tags = await ctx.tx.Tags.find(query).select(['tag']).lean();
  return _.map(tags, 'tag');
}

module.exports = { getTags };
