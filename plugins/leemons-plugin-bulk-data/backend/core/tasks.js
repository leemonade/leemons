/* eslint-disable no-await-in-loop */
const chalk = require('chalk');
const { keys } = require('lodash');
const importTasks = require('./bulk/tasks');
const _delay = require('./bulk/helpers/delay');

async function initTasks({ file, config, ctx }) {
  try {
    const tasks = await importTasks({ filePath: file, config, ctx });

    const tasksKeys = keys(tasks);

    for (let i = 0, len = tasksKeys.length; i < len; i++) {
      const key = tasksKeys[i];
      const { creator, ...task } = tasks[key];

      try {
        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Adding task: ${task.asset?.name}}`);
        const taskData = await ctx.call(
          'tasks.tasks.create',
          { ...task, published: true },
          { meta: { userSession: creator } }
        );
        tasks[key] = { ...taskData };

        ctx.logger.info(chalk`{cyan.bold BULK} Task ADDED: ${task.asset?.name}`);
      } catch (e) {
        ctx.logger.log('-- TASK CREATION ERROR --');
        ctx.logger.log(`task: ${task.asset?.name}`);
        ctx.logger.log(`creator: ${creator.name}`);
        ctx.logger.error(e);
      }

      await _delay(3000);
    }

    return tasks;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initTasks;
