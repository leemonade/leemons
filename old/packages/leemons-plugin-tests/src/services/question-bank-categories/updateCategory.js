const { table } = require('../tables');

async function updateCategory(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { id, ...props } = data;
      return table.questionBankCategories.update(
        { id },
        {
          ...props,
        },
        { transacting }
      );
    },
    table.questionBankCategories,
    _transacting
  );
}

module.exports = { updateCategory };
