const { taskSubjects } = require('../../table');
const removeContents = require('../contents/remove');
const removeObjectives = require('../objectives/remove');
const removeAssessmentCriteria = require('../assessmentCriteria/remove');

function removeCurriculum(task, subject, { transacting } = {}) {
  return Promise.all([
    removeObjectives(task, subject, undefined, { transacting }),
    removeContents(task, subject, undefined, { transacting }),
    removeAssessmentCriteria(task, subject, undefined, { transacting }),
  ]);
}

module.exports = async function deleteSubjects(task, subjects, { transacting } = {}) {
  try {
    const query = { task };

    // EN: Remove curriculum data (if no subjects provided, delete all the task curriculum data)
    // ES: Eliminar los datos del curriculum (si no se proporcionan asignaturas, eliminar todos los datos del curriculum de la tarea)
    if (subjects?.length && Array.isArray(subjects)) {
      await Promise.all(
        subjects.map((subject) => removeCurriculum(task, subject, { transacting })).flat()
      );

      query.subject_$in = subjects;
    } else {
      await removeCurriculum(task, null, { transacting });
    }

    const count = await taskSubjects.deleteMany(query, { transacting });

    return count;
  } catch (e) {
    throw new Error(`Error deleting subjects from task ${task}: ${e.message}`);
  }
};
