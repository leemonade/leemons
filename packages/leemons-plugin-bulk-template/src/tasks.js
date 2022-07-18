/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importTasks = require('./bulk/tasks');

async function initTasks(config) {
  const { services } = leemons.getPlugin('tasks');
  const { chalk } = global.utils;

  try {
    const tasks = await importTasks(config);

    const tasksKeys = keys(tasks);

    for (let i = 0, len = tasksKeys.length; i < len; i++) {
      const key = tasksKeys[i];
      const { creator, ...task } = tasks[key];

      try {
        leemons.log.debug(chalk`{cyan.bold BULK} {gray Adding task: ${task.asset?.name}}`);
        const taskData = await services.tasks.create(task, { userSession: creator });
        tasks[key] = { ...taskData };

        leemons.log.info(chalk`{cyan.bold BULK} Task ADDED: ${task.asset?.name}`);
      } catch (e) {
        console.log('-- TASK CREATION ERROR --');
        // console.dir(task, { depth: null });
        console.log(`task: ${task.asset?.name}`);
        console.log(`creator: ${creator.name}`);
        console.error(e);
      }
    }

    return tasks;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initTasks;
