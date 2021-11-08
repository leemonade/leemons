const { table } = require('../tables');
const { validateAddKnowledge } = require('../../validations/forms');

async function addKnowledge(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddKnowledge(data, { transacting });
      return table.knowledges.create(data, { transacting });
    },
    table.knowledges,
    _transacting
  );
}

module.exports = { addKnowledge };
