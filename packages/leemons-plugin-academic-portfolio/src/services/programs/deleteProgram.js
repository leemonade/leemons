const _ = require('lodash');
const { table } = require('../tables');
const { programsByIds } = require('./programsByIds');

async function deleteProgram(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const program = (await programsByIds(id, { transacting }))[0];
      await leemons.events.emit('before-remove-program', { program, transacting });

      await leemons.events.emit('after-remove-program', { program, transacting });
      return true;
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { deleteProgram };
