const { table } = require('../tables');

async function setSubjectCredits(subject, program, credits, { transacting } = {}) {
  return table.programSubjectsCredits.set(
    { subject, program },
    { subject, program, credits },
    { transacting }
  );
}

module.exports = { setSubjectCredits };
