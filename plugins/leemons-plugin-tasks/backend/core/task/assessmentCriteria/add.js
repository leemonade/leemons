const emit = require('../../events/emit');
const { taskAssessmentCriteria: table } = require('../../table');
const taskExists = require('../exists');
const parseId = require('../helpers/parseId');

module.exports = async function addAssessmentCriteria(
  task,
  subject,
  criteria,
  { transacting } = {}
) {
  const { fullId } = await parseId(task, null, { transacting });

  if (!criteria) {
    return [];
  }
  const _criteria = Array.isArray(criteria) ? criteria : [criteria];

  // EN: Check if task exists.
  // ES: Comprobar si la tarea existe.
  if (!(await taskExists(fullId, { transacting }))) {
    throw new Error('Task not found');
  }

  const createdCriterias = await table.createMany(
    _criteria.map((assessmentCriteria, i) => ({
      task: fullId,
      subject,
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
    subject,
  });

  return createdCriterias.map(({ assessmentCriteria }) => assessmentCriteria);
};
