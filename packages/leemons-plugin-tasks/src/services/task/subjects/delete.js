const { taskSubjects } = require('../../table');

module.exports = async function deleteSubjects(task, subjects, { transacting } = {}) {
  try {
    const query = { task };

    if (subjects?.length && Array.isArray(subjects)) {
      query.subject_$in = subjects;
    }
    const count = await taskSubjects.deleteMany(query, { transacting });

    return count;
  } catch (e) {
    throw new Error(`Error deleting subjects from task ${task}: ${e.message}`);
  }
};
