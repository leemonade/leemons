const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

/**
 * Retrieves tags from the database based on an optional type.
 *
 * @async
 * @function
 * @param {Object} params - Parameters for fetching tags.
 * @param {string|string[]} [params.type] - Optional type (or array of types) to further filter the tags. If not provided, all tags are fetched.
 * @param {Moleculer.Context} params.ctx - The Moleculer service invocation context.
 * @param {Object} params.ctx.tx - Transaction context.
 * @param {Object} params.ctx.tx.db - Database object.
 * @param {Object} params.ctx.tx.db.Tags - The Tags model to query against.
 * @returns {Promise<string[]>} - Returns an array of tags.
 * @throws {LeemonsError} Throws an error if an invalid type is provided.
 */
async function getTags({ type, ctx }) {
  const query = {};
  // Validate 'type' and throw when a truthy unexpected value is intended to serve as 'type'
  if (
    (type && typeof type !== 'string' && !_.isArray(type)) ||
    (_.isArray(type) && (!_.every(type, _.isString) || _.isEmpty(type)))
  ) {
    throw new LeemonsError(ctx, {
      message: `Invalid type provided. Expected string or array of strings.`,
    });
  }

  if (type?.length) {
    query.type = type;
  }

  const tags = await ctx.tx.db.Tags.find(query).select(['tag']).lean();
  return _.map(tags, 'tag');
}

module.exports = { getTags };
