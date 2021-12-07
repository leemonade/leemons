const _ = require('lodash');
const { table } = require('../tables');

async function listCurriculums(page, size, { query, transacting } = {}) {
  return global.utils.paginate(table.curriculums, page, size, query, {
    transacting,
  });
}

module.exports = { listCurriculums };
