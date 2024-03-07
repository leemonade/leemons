const { validateSubjects } = require('../../validations/validateSubjects');

async function saveSubjects({ assignableId, subjects, ctx }) {
  try {
    if (!subjects) {
      return [];
    }
    // TODO: test no subject length
    validateSubjects(subjects);

    const subjectsToSave = subjects.map((subject) => ({
      ...subject,
      assignable: assignableId,
    }));

    await ctx.tx.db.Subjects.create(subjectsToSave);

    return subjectsToSave;
  } catch (e) {
    e.message = `Failed to save assignables' subjects: ${e.message}`;

    throw e;
  }
}

module.exports = { saveSubjects };
