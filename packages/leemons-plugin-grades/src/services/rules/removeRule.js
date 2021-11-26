const _ = require('lodash');
const { table } = require('../tables');

async function removeRule(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      // ES: En cascada se borran los grupos y al borrar los grupos se borran las condiciones
      // EN: In cascade, groups and conditions are deleted in cascade
      await table.rules.delete({ id }, { transacting });

      return true;
    },
    table.rules,
    _transacting
  );
}

module.exports = { removeRule };
