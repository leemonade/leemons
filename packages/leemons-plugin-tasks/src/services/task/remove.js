const { tasks } = require('../table');
const removeTags = require('../tags/remove');

module.exports = async function remove(taskID, { transacting } = {}) {
  // EN: Before removing the task, we need to delete the associated elements.
  // ES: Antes de eliminar la tarea, necesitamos eliminar los elementos asociados.
  await removeTags(taskID, [], { transacting });

  // EN: Finally, we can remove the task.
  // ES: Finalmente, podemos eliminar la tarea.
  const task = await tasks.deleteMany({ id: taskID }, { transacting });

  return task;
};
