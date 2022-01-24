const { tasks } = require('../table');
const parseId = require('./helpers/parseId');

module.exports = async function exists(taskID, { transacting } = {}) {
  const { fullId } = await parseId(taskID, null, { transacting });
  // EN: Check how many tasks are found with the given id (id@version).
  const count = await tasks.count({ id: fullId }, { transacting });

  return count > 0;
};
