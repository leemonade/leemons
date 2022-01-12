const { tasks } = require('../table');

module.exports = async function get(taskID, { transacting } = {}) {
  const task = await tasks.find({ id: taskID }, { transacting });

  return task.length ? task[0] : null;
};
