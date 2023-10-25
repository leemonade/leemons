const _ = require('lodash');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');
const { byIds } = require('./byIds');
const { getMessageIdsByFilters } = require('./getMessageIdsByFilters');

async function list({ page, size, filters, ctx }) {
  const query = {};
  if (filters) {
    const ids = await getMessageIdsByFilters({ item: filters, ctx });
    if (ids !== null) {
      query.id = _.uniq(ids);
    }
    if (filters.zone) {
      query.zone = _.isArray(filters.zone) ? filters.zone : [filters.zone];
    }
    if (filters.status) {
      query.status = _.isArray(filters.status) ? filters.status : [filters.status];
    }
    if (filters.internalName) {
      query.internalName = { $regex: _.escapeRegExp(filters.internalName), $options: 'i' };
    }
  }
  const results = await mongoDBPaginate({
    model: ctx.tx.db.MessageConfig,
    page,
    size,
    columns: ['id'],
    query,
  });

  results.items = await byIds({ ids: _.map(results.items, 'id'), ctx });
  return results;
}

module.exports = { list };
