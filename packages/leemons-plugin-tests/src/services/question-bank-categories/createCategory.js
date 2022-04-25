const { table } = require('../tables');

async function createCategory(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) =>
      table.questionBankCategories.create(
        {
          ...data,
        },
        { transacting }
      ),
    table.questionBankCategories,
    _transacting
  );
}

module.exports = { createCategory };
