const _ = require('lodash');
const { table } = require('../tables');

async function getProgramSubjectTypes(ids, { transacting } = {}) {
  return table.subjectTypes.find({ program_$in: _.isArray(ids) ? ids : [ids] }, { transacting });
}

module.exports = { getProgramSubjectTypes };
