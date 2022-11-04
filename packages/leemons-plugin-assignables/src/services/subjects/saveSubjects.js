const { validateSubjects } = require('../../helpers/validators/subjects');
const { subjects: table } = require('../tables');

module.exports = async function saveSubjects(assignable, subjects, { transacting } = {}) {
  try {
    if (!subjects) {
      return [];
    }

    validateSubjects(subjects);

    await table.createMany(
      subjects.map(({ subject, level, curriculum, program }) => ({
        assignable,
        subject,
        level,
        program,
        curriculum: JSON.stringify(curriculum),
      })),
      { transacting }
    );

    return subjects.map(({ subject, level, curriculum, program }) => ({
      assignable,
      subject,
      level,
      program,
      curriculum,
    }));
  } catch (e) {
    e.message = `Failed to create subjects: ${e.message}`;
    throw e;
  }
};
