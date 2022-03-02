const { taskSubjects } = require('../../table');

module.exports = async function addSubjects(task, subject, { transacting } = {}) {
  const subjects = Array.isArray(subject) ? subject : [subject];

  try {
    await taskSubjects.createMany(
      subjects.map((s) => ({
        task,
        subject: s.subject,
        level: s.level,
      })),
      { transacting }
    );

    return true;
  } catch (e) {
    throw new Error(`Error adding subjects to task ${task.id}: ${e.message}`);
  }
};
