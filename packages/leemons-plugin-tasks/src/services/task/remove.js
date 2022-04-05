const { tasks } = require('../table');
const removeTags = require('../tags/remove');
const removeVersion = require('./versions/remove');
const removeAttachments = require('../attachments/remove');
const parseId = require('./helpers/parseId');
const emit = require('../events/emit');
const deleteSubjects = require('./subjects/delete');
const deleteTags = require('../tags/remove');
const deleteObjectives = require('./objectives/remove');
const deletecontents = require('./contents/remove');
const deleteAssessmentCriteria = require('./assessmentCriteria/remove');
const deleteAttachments = require('../attachments/remove');
const getVersion = require('./versions/get');
const getVersions = require('./versions/getVersions');
const removeInstances = require('../assignment/instance/remove');

async function remove(taskID, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
        const { fullId, id } = await parseId(taskID, null, { transacting });
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
        const task = await tasks.deleteMany({ id: fullId }, { transacting });

        // EN: Remove the task versioning.
        // ES: Eliminar el versionado de la tarea.
        await removeVersion(fullId, { transacting });

        // EN: Remove the subjects
        // ES: Eliminar las asignaturas
        await deleteSubjects(fullId, undefined, { transacting });

        // EN: Remove tags
        // ES: Eliminar etiquetas
        await deleteTags(fullId, undefined, { transacting });

        // EN: Remove attachments
        // ES: Eliminar adjuntos
        await deleteAttachments(fullId, undefined, { transacting });

        // EN: Remove the assigned instances
        // ES: Eliminar las instancias asignadas
        await removeInstances(fullId, undefined, { transacting });

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
}

module.exports = async function removeAllTasks(taskId, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
        const { fullId, id } = await parseId(taskId, null, { transacting });

        // EN: Check if the task version is published or draft.
        // ES: Comprobar si la versión de la tarea está publicada o borrador.
        const task = await getVersion(fullId, { transacting });

        const status = task?.status;

        if (!status) {
          return {
            soft: false,
            versionsDeleted: 0,
          };
        }

        const versions = await getVersions(id, { status, transacting });

        const result = await Promise.all(
          versions.map((version) => remove(version.id, { transacting }))
        );

        return {
          soft: false,
          versionsDeleted: result.length,
        };
      } catch (e) {
        throw new Error(`Error removing task: ${e.message}`);
      }
    },
    tasks,
    t
  );
};
