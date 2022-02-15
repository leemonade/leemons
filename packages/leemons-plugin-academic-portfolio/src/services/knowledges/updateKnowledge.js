const { table } = require('../tables');
const { validateUpdateKnowledge } = require('../../validations/forms');

async function updateKnowledge(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateKnowledge(data, { transacting });
      const { id, ..._data } = data;
      return table.knowledges.update({ id }, _data, { transacting });
    },
    table.knowledges,
    _transacting
  );
}

module.exports = { updateKnowledge };
