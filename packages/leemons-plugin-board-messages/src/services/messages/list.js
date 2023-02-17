const _ = require('lodash');
const { table } = require('../tables');
const { byIds } = require('./byIds');
const { getMessageIdsByFilters } = require('./getMessageIdsByFilters');

async function list(page, size, { userSession, filters, transacting } = {}) {
  const query = {};
  if (filters) {
    const ids = await getMessageIdsByFilters(filters, { transacting });
    if (ids !== null) {
      query.id_$in = _.uniq(ids);
    }
    if (filters.zone) {
      query.zone_$in = _.isArray(filters.zone) ? filters.zone : [filters.zone];
    }
    if (filters.status) {
      query.status_$in = _.isArray(filters.status) ? filters.status : [filters.status];
    }
    if (filters.internalName) {
      query.internalName_$contains = filters.internalName;
    }
  }
  const results = await global.utils.paginate(table.messageConfig, page, size, query, {
    transacting,
    columns: ['id'],
  });

  results.items = await byIds(_.map(results.items, 'id'), { userSession, transacting });
  return results;
}

module.exports = { list };
