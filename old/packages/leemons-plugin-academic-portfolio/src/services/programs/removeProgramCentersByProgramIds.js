const _ = require('lodash');
const { table } = require('../tables');

async function removeProgramCentersByProgramIds(
  programIds,
  { soft, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const programCenter = await table.programCenter.find(
        { program_$in: _.isArray(programIds) ? programIds : [programIds] },
        { transacting }
      );
      await leemons.events.emit('before-remove-program-center', {
        programCenter,
        soft,
        transacting,
      });
      await table.programCenter.deleteMany(
        { id_$in: _.map(programCenter, 'id') },
        { soft, transacting }
      );
      await leemons.events.emit('after-remove-program-center', {
        programCenter,
        soft,
        transacting,
      });
      return true;
    },
    table.programCenter,
    _transacting
  );
}

module.exports = { removeProgramCentersByProgramIds };
