const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

/**
 * Retrieves tags associated with given values.
 *
 * @async
 * @function
 * @param {Object} params - Parameters for retrieving tags.
 * @param {(string|string[]|Object|Object[])} [params.type] - The type or types to filter by. Cannot be an object or an array containing objects.
 * @param {(string|string[])} params.values - Values to retrieve tags for.
 * @param {Object} params.ctx - Moleculer context, specifically expecting ctx.tx.db.Tags for DB operations.
 * @returns {Promise<string[][]>} - Array of arrays, where each inner array represents tags associated with a given value.
 * @throws {LeemonsError} Throws an error if the 'type' parameter is an object or contains objects in its array.
 *
 * @example
 * const tags = await getValuesTags({
 *     type: 'someType',
 *     values: ['value1', 'value2'],
 *     ctx: moleculerContext
 * });
 */
async function getValuesTags({ type, values, ctx }) {
  let _values = _.isArray(values) ? values : [values];
  if (_values.length === 0) return [];

  _values = _.map(_values, (value) => JSON.stringify(value));
  const query = { value: _values };

  if (_.isPlainObject(type) || _.some(type, _.isPlainObject)) {
    throw new LeemonsError(ctx, {
      message: 'Type cannot be an object or an array with objects',
    });
  }
  if (type) {
    query.type = type;
  }

  const tags = await ctx.tx.db.Tags.find(query).lean();
  const tagsByValue = _.groupBy(tags, 'value');

  return _.map(_values, (value) => (tagsByValue[value] ? _.map(tagsByValue[value], 'tag') : []));
}

module.exports = { getValuesTags };
