const emit = require('../../events/emit');
const { taskObjectives: table } = require('../../table');
const taskExists = require('../exists');
const parseId = require('../helpers/parseId');

module.exports = async function addObjectives(task, subject, objectives, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });
  const { fullId } = await parseId(id, 'any', { transacting });

  if (!objectives) {
    return [];
  }
  const _objectives = Array.isArray(objectives) ? objectives : [objectives];

  // EN: Check if task exists.
  // ES: Comprobar si la tarea existe.
  if (!(await taskExists(fullId, { transacting }))) {
    throw new Error('Task not found');
  }

  const createdObjectives = await table.createMany(
    _objectives.map((objective, i) => ({
      task: id,
      subject,
      objective,
      position: i,
    })),
    {
      transacting,
    }
  );

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.objectives.added', `task.${id}.objectives.added`], { id, subject });

  return createdObjectives.map(({ objective }) => objective);
};
