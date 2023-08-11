const { getCourseIndex } = require('../courses/getCourseIndex');

async function setSubjectInternalId({ subject, program, internalId, course, ctx }) {
  const toSave = {
    subject,
    program,
    internalId,
    compiledInternalId: (course ? await getCourseIndex({ course, ctx }) : '') + internalId,
  };
  if (course) toSave.course = course;
  return ctx.tx.db.ProgramSubjectsCredits.findOneAndUpdate({ subject, program }, toSave, {
    upsert: true,
  });
}

module.exports = { setSubjectInternalId };
