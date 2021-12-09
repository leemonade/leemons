const _ = require('lodash');
const { table } = require('../tables');

async function removeProgramConfigsByProgramIds(
  programIds,
  { soft, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const configs = await table.configs.find(
        {
          $or: _.map(_.isArray(programIds) ? programIds : [programIds], (programId) => ({
            key_$startsWith: `program-${programId}`,
          })),
        },
        { transacting }
      );
      await leemons.events.emit('before-remove-program-configs', {
        configs,
        soft,
        transacting,
      });
      await table.configs.deleteMany({ id_$in: _.map(configs, 'id') }, { soft, transacting });
      await leemons.events.emit('after-remove-program-configs', {
        configs,
        soft,
        transacting,
      });
      return true;
    },
    table.configs,
    _transacting
  );
}

module.exports = { removeProgramConfigsByProgramIds };
