const { taskSubjects } = require('../../table');
const getAssessmentCriteria = require('../assessmentCriteria/get');
const getContents = require('../contents/get');
const getObjectives = require('../objectives/get');

async function getCurriculum(task, subject, { transacting } = {}) {
  const [contents, objectives, assessmentCriteria] = await Promise.all([
    getContents(task, subject, {
      transacting,
    }),
    getObjectives(task, subject, { transacting }),
    getAssessmentCriteria(task, subject, { transacting }),
  ]);

  return {
    contents: contents.content,
    objectives: objectives.objectives,
    assessmentCriteria: assessmentCriteria.assessmentCriteria,
  };
}

module.exports = async function getSubjects(task, { transacting } = {}) {
  try {
    const subjects = await taskSubjects.find(
      { task_$in: Array.isArray(task) ? task : [task] },
      { transacting }
    );

    if (Array.isArray(task)) {
      return subjects.reduce(async (accum, s) => {
        const acc = await accum;

        const obj = {
          subject: s.subject,
          level: s.level,
          course: s.course,
          curriculum: await getCurriculum(s.task, s.subject, { transacting }),
        };

        acc[s.task] = Array.isArray(acc[s.task]) ? [...acc[s.task], obj] : [obj];
        return acc;
      }, {});
    }

    return Promise.all(
      subjects.map(async (s) => ({
        subject: s.subject,
        level: s.level,
        course: s.course,
        curriculum: await getCurriculum(task, s.subject, { transacting }),
      }))
    );
  } catch (e) {
    throw new Error(`Error getting subjects from task ${task.id}: ${e.message}`);
  }
};
