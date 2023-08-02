const _ = require('lodash');
const { table } = require('../tables');

async function getProgramSubjects(ids, { transacting } = {}) {
  return table.subjects.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting });
}

module.exports = { getProgramSubjects };
