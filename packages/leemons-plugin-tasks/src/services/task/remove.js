const { tasks, tasksVersioning } = require('../table');
const removeTags = require('../tags/remove');
const removeAttachments = require('../attachments/remove');
const parseId = require('./helpers/parseId');
const emit = require('../events/emit');

module.exports = async function remove(taskID, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
        const { fullId, id } = await parseId(taskID);
        // EN: Before removing the task, we need to delete the associated elements.
        // ES: Antes de eliminar la tarea, necesitamos eliminar los elementos asociados.

        // EN: Remove the tags.
        // ES: Eliminar las etiquetas.
        await removeTags(fullId, [], { transacting });

        // EN: Remove the attachments.
        // ES: Eliminar los adjuntos.
        await removeAttachments(fullId, [], { transacting });

        // EN: Finally, we can remove the task.
        // ES: Finalmente, podemos eliminar la tarea.
        const task = await tasks.deleteMany({ id_$startsWith: id }, { transacting });

        // EN: Remove the task versioning.
        // ES: Eliminar el versionado de la tarea.
        await tasksVersioning.deleteMany({ id }, { transacting });

        // EN: Emit the event.
        // ES: Emitir el evento.
        emit(['task.remove', `task.${id}.remove`], { id });

        return {
          soft: task.soft,
          versionsDeleted: task.count,
        };
      } catch (e) {
        throw new Error(`Error removing task: ${e.message}`);
      }
    },
    tasks,
    t
  );
};
