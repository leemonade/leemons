const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

/**
 * Retrieves tag values from the database based on given tags and an optional type.
 *
 * @async
 * @function
 * @param {Object} params - Parameters for fetching tag values.
 * @param {(string|string[])} params.tags - Tag or array of tags to search for.
 * @param {string} [params.type] - Optional type to further filter the tags.
 * @param {Moleculer.Context} params.ctx - The Moleculer service invocation context which provides context for this action call.
 * @param {Object} params.ctx.tx - Transaction context.
 * @param {Object} params.ctx.tx.db - Database object.
 * @param {Object} params.ctx.tx.db.Tags - The Tags model to query against.
 * @returns {Promise<Array>} - An array containing arrays of tag values. Each inner array corresponds to a tag from the input.
 * @throws {LeemonsError} Throws an error if tags array is empty.
 */

async function getTagsValues({ tags, type, ctx }) {
  // Validate type
  if (!tags?.length || (_.isArray(tags) && !_.every(tags, _.isString))) {
    throw new LeemonsError(ctx, {
      message: 'Tags must be a not empty string or array of strings.',
    });
  }

  const _tags = _.isArray(tags) ? tags : [tags];
  const query = { tag: _tags };

  // Validate 'type' and throw when a truthy unexpected value is intended to serve as 'type'
  if (
    (type && typeof type !== 'string' && !_.isArray(type)) ||
    (_.isArray(type) && (!_.every(type, _.isString) || _.isEmpty(type)))
  ) {
    throw new LeemonsError(ctx, {
      message: 'Type must be a not empty string or array of strings. No type filter applied.',
    });
  }

  if (type?.length) {
    query.type = type;
  }

  const foundTags = await ctx.tx.db.Tags.find(query).lean();
  const tagsByTag = _.groupBy(foundTags, 'tag');
  const result = _.map(_tags, (tagName) =>
    tagsByTag[tagName] ? _.map(tagsByTag[tagName], (tag) => JSON.parse(tag.value)) : []
  );

  return result;
}

module.exports = { getTagsValues };
