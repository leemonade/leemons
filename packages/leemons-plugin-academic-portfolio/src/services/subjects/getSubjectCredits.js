const { table } = require('../tables');

async function getSubjectCredits(subject, program, { transacting } = {}) {
  return table.programSubjectsCredits.findOne({ subject, program }, { transacting });
}

module.exports = { getSubjectCredits };
