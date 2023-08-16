const { taskSubjects } = require('../../table');
const addAssessmentCriteria = require('../assessmentCriteria/add');
const addContents = require('../contents/add');
const addObjectives = require('../objectives/add');

module.exports = async function addSubjects(task, subject, { transacting: t } = {}) {
  if (!subject) {
    return false;
  }

  const subjects = Array.isArray(subject) ? subject : [subject];

  try {
    return await global.utils.withTransaction(
      async (transacting) => {
        // EN: Save curriculum data for each subject.
        // ES: Guardar los datos del curriculum para cada asignatura.
        await Promise.all(
          subjects.map(({ curriculum, subject: s }) => {
            const operations = [];
            if (curriculum?.contents) {
              operations.push(addContents(task, s, curriculum.contents, { transacting }));
            }

            if (curriculum?.objectives) {
              operations.push(addObjectives(task, s, curriculum.objectives, { transacting }));
            }

            if (curriculum?.assessmentCriteria) {
              operations.push(
                addAssessmentCriteria(task, s, curriculum.assessmentCriteria, { transacting })
              );
            }

            return Promise.all(operations);
          })
        );

        // EN: Save subjects data.
        // ES: Guardar los datos de las asignaturas.
        await taskSubjects.createMany(
          subjects.map((s) => ({
            task,
            subject: s.subject,
            level: s.level,
            course: s.course,
          })),
          { transacting }
        );

        return true;
      },
      taskSubjects,
      t
    );
  } catch (e) {
    throw new Error(`Error adding subjects to task ${task}: ${e.message}`);
  }
};
