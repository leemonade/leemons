const _ = require('lodash');
const { table } = require('../tables');
const { getMessageIdsByFilters } = require('./getMessageIdsByFilters');

async function getOverlapsWithOtherConfigurations(_item, { transacting } = {}) {
  const item = { ..._item };

  if (!item.startDate || item.publicationType === 'immediately') {
    item.startDate = new Date();
  }
  if (!item.endDate || item.publicationType === 'immediately') {
    item.endDate = new Date('01/01/9999');
  }

  item.startDate = new Date(item.startDate);
  item.endDate = new Date(item.endDate);

  const query = {
    zone: item.zone,
    status_$in: ['published', 'programmed'],
    $not: { $or: [{ endDate_$lt: item.startDate }, { startDate_$gt: item.endDate }] },
  };
  if (item.id) {
    query.id_$ne = item.id;
  }
  const ids = await getMessageIdsByFilters(item, { transacting });
  if (ids !== null) {
    query.id_$in = _.uniq(ids);
  }
  const items = await table.messageConfig.find(query, { transacting });
  return items;
}

module.exports = { getOverlapsWithOtherConfigurations };
