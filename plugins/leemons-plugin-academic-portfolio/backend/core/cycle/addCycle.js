const { table } = require('../tables');
const { validateAddCycle } = require('../../validations/forms');

async function addCycle(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddCycle(data, { transacting });
      return table.cycles.create(
        { ...data, courses: JSON.stringify(data.courses) },
        { transacting }
      );
    },
    table.groups,
    _transacting
  );
}

module.exports = { addCycle };
