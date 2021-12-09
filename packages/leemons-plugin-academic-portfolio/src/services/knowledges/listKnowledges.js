const { table } = require('../tables');

async function listKnowledges(page, size, program, { transacting } = {}) {
  return global.utils.paginate(
    table.knowledges,
    page,
    size,
    {
      program,
    },
    {
      transacting,
    }
  );
}

module.exports = { listKnowledges };
