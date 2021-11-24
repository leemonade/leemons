const _ = require('lodash');
const { table } = require('../tables');

async function removeGroupByIds(ids, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const groups = await table.groups.find(
        { id_$in: _.isArray(ids) ? ids : [ids], type: 'group' },
        { transacting }
      );
      await leemons.events.emit('before-remove-groups', { groups, soft, transacting });
      await table.groups.deleteMany({ id_$in: _.map(groups, 'id') }, { soft, transacting });
      await leemons.events.emit('after-remove-groups', { groups, soft, transacting });
      return true;
    },
    table.groups,
    _transacting
  );
}

module.exports = { removeGroupByIds };
