const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');

module.exports = async function get(taskId, { transacting } = {}) {
  try {
    const { fullId, id } = await parseId(taskId);
    // EN: Get the name from the task (in taskVersioning)
    // ES: Obtener el nombre de la tarea (en taskVersioning)
    const [{ name }] = await tasksVersioning.find({ id }, { columns: ['name'], transacting });
    // EN: Get task by id (id@version).
    // ES: Obtener tarea por id (id@version).
    const task = await tasks.find({ id: fullId }, { transacting });

    return task.length ? { ...task[0], name } : null;
  } catch (e) {
    throw new Error(`Error getting task: ${e.message}`);
  }
};
