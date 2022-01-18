const { tasks } = require('../table');
const removeTags = require('../tags/remove');
const removeAttachments = require('../attachments/remove');
const events = require('../../../events');

module.exports = async function remove(taskID, { transacting } = {}) {
  // EN: Before removing the task, we need to delete the associated elements.
  // ES: Antes de eliminar la tarea, necesitamos eliminar los elementos asociados.

  // EN: Remove the tags.
  // ES: Eliminar las etiquetas.
  await removeTags(taskID, [], { transacting });

  // EN: Remove the attachments.
  // ES: Eliminar los adjuntos.
  await removeAttachments(taskID, [], { transacting });

  // EN: Finally, we can remove the task.
  // ES: Finalmente, podemos eliminar la tarea.
  const task = await tasks.deleteMany({ id: taskID }, { transacting });

  // EN: Emit the event.
  // ES: Emitir el evento.
  events(['task.remove', `task.${taskID}.remove`]).emit({ id: taskID });

  return task;
};
