const emit = require('../../events/emit');
const { taskAssessmentCriteria: table } = require('../../table');
const taskExists = require('../exists');
const parseId = require('../helpers/parseId');

module.exports = async function addAssessmentCriteria(task, criterias, { transacting } = {}) {
  const { fullId } = await parseId(task, null, { transacting });

  if (!criterias) {
    return [];
  }
  const _criterias = Array.isArray(criterias) ? criterias : [criterias];

  // EN: Check if task exists.
  // ES: Comprobar si la tarea existe.
  if (!(await taskExists(fullId, { transacting }))) {
    throw new Error('Task not found');
  }

  const createdCriterias = await table.createMany(
    _criterias.map((assessmentCriteria, i) => ({
      task: fullId,
      assessmentCriteria,
      position: i,
    })),
    {
      transacting,
    }
  );

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.assessmentCriteria.added', `task.${fullId}.assessmentCriteria.added`], {
    id: fullId,
  });

  return createdCriterias.map(({ assessmentCriteria }) => assessmentCriteria);
};
