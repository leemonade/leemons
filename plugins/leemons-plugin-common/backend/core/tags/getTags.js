const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

async function getTags({ type, ctx }) {
  if (
    (type && typeof type !== 'string' && !_.isArray(type)) ||
    (_.isArray(type) && !_.every(type, _.isString))
  ) {
    throw new LeemonsError(ctx, {
      message: `Invalid type provided. Expected string or array of strings.`,
    });
  }
  const query = {};

  if (type?.length) {
    query.type = type;
  }
  const tags = await ctx.tx.db.Tags.find(query).select(['tag']).lean();
  return _.map(tags, 'tag');
}

module.exports = { getTags };
