const { table } = require('../tables');
const { getCourseIndex } = require('../courses/getCourseIndex');

async function setSubjectInternalId(subject, program, internalId, { course, transacting } = {}) {
  const toSave = {
    subject,
    program,
    internalId,
    compiledInternalId: (course ? await getCourseIndex(course, { transacting }) : '') + internalId,
  };
  if (course) toSave.course = course;
  return table.programSubjectsCredits.set({ subject, program }, toSave, { transacting });
}

module.exports = { setSubjectInternalId };
