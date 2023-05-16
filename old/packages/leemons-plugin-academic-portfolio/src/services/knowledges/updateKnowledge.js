const { table } = require('../tables');
const { validateUpdateKnowledge } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateKnowledge(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateKnowledge(data, { transacting });
      const { id, managers, ..._data } = data;

      const [knowledge] = await Promise.all([
        table.knowledges.update({ id }, _data, { transacting }),
        saveManagers(managers, 'knowledge', id, { transacting }),
      ]);
      return knowledge;
    },
    table.knowledges,
    _transacting
  );
}

module.exports = { updateKnowledge };
