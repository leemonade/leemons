const { table } = require('../tables');

async function setSubjectInternalId(subject, program, internalId, { transacting } = {}) {
  return table.programSubjectsCredits.set(
    { subject, program },
    { subject, program, internalId },
    { transacting }
  );
}

module.exports = { setSubjectInternalId };
