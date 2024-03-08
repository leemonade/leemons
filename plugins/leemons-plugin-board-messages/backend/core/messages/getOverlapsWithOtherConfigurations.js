const _ = require('lodash');
const { getMessageIdsByFilters } = require('./getMessageIdsByFilters');

async function getOverlapsWithOtherConfigurations({ item: _item, ctx }) {
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
    status: ['published', 'programmed'],
    $nor: [{ endDate: { $lt: item.startDate } }, { startDate: { $gt: item.endDate } }],
  };
  if (item.id) {
    query.id = { $ne: item.id };
  }
  const ids = await getMessageIdsByFilters({ item, ctx });
  if (ids !== null) {
    query.id = _.uniq(ids);
  }
  return ctx.tx.db.MessageConfig.find(query).lean();
}

module.exports = { getOverlapsWithOtherConfigurations };
