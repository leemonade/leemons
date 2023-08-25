const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');
const { LeemonsError } = require('leemons-error');
/**
 * Lists tags from the database using pagination.
 *
 * @async
 * @param {Object} params - Parameters for listing tags.
 * @param {number} params.page - The current page number.
 * @param {number} params.size - The number of items per page.
 * @param {Object} [params.query={}] - Optional MongoDB query to filter the results.
 * @param {Moleculer.Context} params.ctx - Moleculer service invocation context.
 * @param {Object} params.ctx.tx - Transaction context.
 * @param {Object} params.ctx.tx.db - Database object.
 * @param {Object} params.ctx.tx.db.Tags - The Tags model to query against.
 * @returns {Object} The paginated results containing tags.
 * @returns {Array.<string>} results.items - An array of tag strings.
 * @returns {number} results.count - Number of tags in the current result set.
 * @returns {number} results.totalCount - Total number of tags that match the query.
 * @returns {number} results.totalPages - Total number of pages.
 * @returns {number} results.page - Current page number.
 * @returns {number} results.size - Number of items per page.
 * @returns {number} results.nextPage - The next page number.
 * @returns {number} results.prevPage - The previous page number.
 * @returns {boolean} results.canGoPrevPage - Flag indicating if there's a previous page.
 * @returns {boolean} results.canGoNextPage - Flag indicating if there's a next page.
 */

async function listTags({ page, size, query = {}, ctx }) {
  if (!Number.isInteger(page) || !Number.isInteger(size))
    throw new LeemonsError(ctx, { message: 'Page and size should be Numbers' });

  if (query && Object.prototype.toString.call(query) !== '[object Object]') {
    throw new LeemonsError(ctx, { message: 'Wrong type for Query, object expected.' });
  }

  const results = await mongoDBPaginate({
    model: ctx.tx.db.Tags,
    page,
    size,
    query,
    columns: ['tag'],
  });

  results.items = _.map(results.items, 'tag');
  return results;
}

module.exports = { listTags };
