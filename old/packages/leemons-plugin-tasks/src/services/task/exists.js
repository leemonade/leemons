const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');

module.exports = async function exists(taskID, { transacting } = {}) {
  const { fullId, id, version } = await parseId(taskID, null, { transacting });

  if (version === 'any') {
    const count = await tasksVersioning.count({ id }, { transacting });

    return count > 0;
  }

  // EN: Check how many tasks are found with the given id (id@version).
  const count = await tasks.count({ id: fullId }, { transacting });

  return count > 0;
};
