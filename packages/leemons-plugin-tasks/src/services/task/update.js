const emit = require('../events/emit');
const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');
const upgradeVersion = require('./helpers/upgradeVersion');

module.exports = async function update(
  taskId,
  {
    name,
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
  { transacting: t } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
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
        const { id, fullId } = await parseId(taskId, null, { transacting });

        // EN: Get the last version from the task
        // ES: Obtener la última versión de la tarea
        const [taskInfo] = await tasksVersioning.find({ id }, { transacting });

        // EN: Get the task
        // ES: Obtener la tarea
        const [taskToUpdate] = await tasks.find({ id: fullId }, { transacting });

        if (!taskToUpdate) {
          throw new Error('Task not found');
        }

        // EN: Keep the same version if the task is not published yet
        // ES: Mantiene la misma versión si la tarea no está publicada aún
        let { version } = await parseId(taskToUpdate.id, null, { transacting });

        // EN: If the task is published, upgrade the version
        // ES: Si la tarea está publicada, actualizar la versión
        // TODO: For now, we only support updating the current version and major upgrade
        if (taskToUpdate.published) {
          version = upgradeVersion(taskInfo.last, 'major');
        }

        // EN: Update the task versioning
        // ES: Actualizar el versionado de la tarea
        await tasksVersioning.set({ id }, { last: version, name }, { transacting });

        // EN: Update the task
        // ES: Actualizar la tareas
        const newTask = await tasks.set({ id: (await parseId(id, version)).fullId }, task, {
          transacting,
        });

        // EN: Emit the event.
        // ES: Emitir el evento.
        emit(['task.updated', `task.${id}.updated`], { id, version, changes: task });

        return { ...newTask, id, fullId, version, name: name ?? taskInfo.name };
      } catch (error) {
        throw new Error(`Error updating task: ${error.message}`);
      }
    },
    tasks,
    t
  );
};
