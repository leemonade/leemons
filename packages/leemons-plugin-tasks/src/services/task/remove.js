const { tasks } = require('../table');

module.exports = async function remove(taskID, { transacting } = {}) {
  const task = await tasks.deleteMany({ id: taskID }, { transacting });

  return task;
};
