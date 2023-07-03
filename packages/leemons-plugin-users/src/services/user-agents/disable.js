const _ = require('lodash');
const { table } = require('../tables');

async function disable(id, { transacting } = {}) {
  const _ids = _.isArray(id) ? id : [id];
  const userAgents = await table.userAgent.find(
    { id_$in: _ids, $or: [{ disabled_$null: true }, { disabled: false }] },
    { columns: ['id'], transacting }
  );
  const ids = _.map(userAgents, 'id');
  await leemons.events.emit('before-disable-user-agents', {
    ids,
    transacting,
  });
  // return table.userAgent.update({ id_$in: ids }, { disabled: true }, { transacting });
}

module.exports = {
  disable,
};
