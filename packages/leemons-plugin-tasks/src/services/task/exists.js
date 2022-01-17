const { tasks } = require('../table');

module.exports = async function exists(taskID, { transacting } = {}) {
  const count = await tasks.count({ id: taskID }, { transacting });

  return count > 0;
};
