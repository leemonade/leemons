const _ = require('lodash');
const { table } = require('../tables');

async function removeSubstageByIds(ids, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const substages = await table.groups.find(
        { id_$in: _.isArray(ids) ? ids : [ids], type: 'substage' },
        { transacting }
      );
      await leemons.events.emit('before-remove-substages', { substages, soft, transacting });
      await table.groups.deleteMany({ id_$in: _.map(substages, 'id') }, { soft, transacting });
      await leemons.events.emit('after-remove-substages', { substages, soft, transacting });
      return true;
    },
    table.groups,
    _transacting
  );
}

module.exports = { removeSubstageByIds };
