/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importTasks = require('./bulk/tasks');

async function initTasks(config) {
  const { services } = leemons.getPlugin('tasks');

  try {
    const tasks = await importTasks(config);
    const tasksKeys = keys(tasks);

    for (let i = 0, len = tasksKeys.length; i < len; i++) {
      const key = tasksKeys[i];
      const { creator, ...task } = tasks[key];
      const taskData = await services.tasks.create(task, { userSession: creator });
      tasks[key] = { ...taskData };
    }

    return tasks;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initTasks;
