const { table } = require('../tables');

async function listQuestionsBanks(page, size, { transacting } = {}) {
  return global.utils.paginate(
    table.questionsBanks,
    page,
    size,
    {},
    {
      transacting,
    }
  );
}

module.exports = { listQuestionsBanks };
