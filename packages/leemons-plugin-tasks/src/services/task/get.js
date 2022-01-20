const { tasks } = require('../table');
const parseId = require('./helpers/parseId');

module.exports = async function get(id, { transacting } = {}) {
  const { fullId } = await parseId(id);
  // EN: Get task by id (id@version).
  // ES: Obtener tarea por id (id@version).
  const task = await tasks.find({ id: fullId }, { transacting });

  return task.length ? task[0] : null;
};
