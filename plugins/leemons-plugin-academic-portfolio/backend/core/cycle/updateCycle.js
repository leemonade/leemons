const { table } = require('../tables');
const { validateUpdateCycle } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateCycle(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateCycle(data, { transacting });

      const { id, managers, ..._data } = data;

      const [cycle] = await Promise.all([
        table.cycles.update({ id }, _data, { transacting }),
        saveManagers(managers, 'cycle', id, { transacting }),
      ]);
      return cycle;
    },
    table.cycles,
    _transacting
  );
}

module.exports = { updateCycle };
