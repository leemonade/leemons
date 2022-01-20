const emit = require('../events/emit');
const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');
const upgradeVersion = require('./helpers/upgradeVersion');

module.exports = async function update(
  taskId,
  {
    tagline,
    level,
    summary,
    cover,
    color,
    methodology,
    recommendedDuration,
    statement,
    development,
    submissions,
    selfReflection,
    feedback,
    instructionsForTeacher,
    instructionsForStudent,
    state,
    published,
  },
  { transacting } = {}
) {
  const task = {
    tagline,
    level,
    summary,
    cover,
    color,
    methodology,
    recommendedDuration,
    statement,
    development,
    submissions,
    selfReflection,
    feedback,
    instructionsForTeacher,
    instructionsForStudent,
    state,
    published,
  };

  // EN: Get the id from complete id@version
  // ES: Obtener el id de la id@version completa
  const { id } = await parseId(taskId);

  // EN: Get the last version from the task
  // ES: Obtener la última versión de la tarea
  const [taskInfo] = await tasksVersioning.find({ id });

  // TODO: For now, we only support updating the current version and major upgrade
  const version = upgradeVersion(taskInfo.last, 'major');

  // EN: Update the task versioning
  // ES: Actualizar el versionado de la tarea
  await tasksVersioning.set({ id }, { current: version, last: version });

  // EN: Update the task
  // ES: Actualizar la tareas
  const newTask = await tasks.set({ id: (await parseId(id, version)).fullId }, task, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.updated', `task.${id}.updated`], { id, version, changes: task });

  return newTask;
};
