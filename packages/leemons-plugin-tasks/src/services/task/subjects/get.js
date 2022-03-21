const { taskSubjects } = require('../../table');

module.exports = async function addSubjects(task, { transacting } = {}) {
  try {
    const subjects = await taskSubjects.find(
      { task_$in: Array.isArray(task) ? task : [task] },
      { transacting }
    );

    if (Array.isArray(task)) {
      return subjects.reduce((acc, s) => {
        const obj = {
          subject: s.subject,
          level: s.level,
          course: s.course,
        };

        acc[s.task] = Array.isArray(acc[s.task]) ? [...acc[s.task], obj] : [obj];
        return acc;
      }, {});
    }

    return subjects.map((s) => ({ subject: s.subject, level: s.level, course: s.course }));
  } catch (e) {
    throw new Error(`Error getting subjects from task ${task.id}: ${e.message}`);
  }
};
