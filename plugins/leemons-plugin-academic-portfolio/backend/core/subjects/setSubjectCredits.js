async function setSubjectCredits({ subject, program, credits, ctx }) {
  return ctx.tx.db.ProgramSubjectsCredits.findOneAndUpdate(
    { subject, program },
    { subject, program, credits },
    { upsert: true, new: true }
  );
}

module.exports = { setSubjectCredits };
