const { table } = require('../tables');

async function listSubjectType(page, size, { transacting } = {}) {
  return global.utils.paginate(table.subjectTypes, page, size, undefined, {
    transacting,
  });
}

module.exports = { listSubjectType };
