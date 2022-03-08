const emit = require('../../events/emit');
const { taskAssessmentCriteria: table } = require('../../table');
const taskExists = require('../exists');
const parseId = require('../helpers/parseId');

module.exports = async function addAssessmentCriteria(task, criterias, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });
  const { fullId } = await parseId(id, 'any', { transacting });

  const _criterias = Array.isArray(criterias) ? criterias : [criterias];

  // EN: Check if task exists.
  // ES: Comprobar si la tarea existe.
  if (!(await taskExists(fullId, { transacting }))) {
    throw new Error('Task not found');
  }

  const createdCriterias = await table.createMany(
    _criterias.map((assessmentCriteria, i) => ({
      task: id,
      assessmentCriteria,
      position: i,
    })),
    {
      transacting,
    }
  );

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.assessmentCriteria.added', `task.${id}.assessmentCriteria.added`], { id });

  return createdCriterias.map(({ assessmentCriteria }) => assessmentCriteria);
};
