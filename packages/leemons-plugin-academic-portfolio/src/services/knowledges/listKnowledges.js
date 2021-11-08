const { table } = require('../tables');

async function listKnowledges(page, size, { transacting } = {}) {
  return global.utils.paginate(table.knowledges, page, size, undefined, {
    transacting,
  });
}

module.exports = { listKnowledges };
