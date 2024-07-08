/* eslint-disable no-await-in-loop */
const chalk = require('chalk');
const { keys } = require('lodash');
const importTasks = require('./bulk/tasks');
const _delay = require('./bulk/helpers/delay');
const { LOAD_PHASES } = require('./importHandlers/getLoadStatus');
const { makeAssetNotIndexable } = require('./helpers/makeAssetNotIndexable');

async function initTasks({ file, config, ctx, useCache, phaseKey }) {
  try {
    const tasks = await importTasks({ filePath: file, config, ctx });

    const tasksKeys = keys(tasks);

    for (let i = 0, len = tasksKeys.length; i < len; i++) {
      const key = tasksKeys[i];
      const { creator, hideInLibrary, ...task } = tasks[key];

      try {
        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Adding task: ${task.asset?.name}}`);
        const taskData = await ctx.call(
          'tasks.tasks.create',
          { ...task, published: true },
          { meta: { userSession: creator } }
        );

        if (hideInLibrary) {
          const { task: taskDetail } = await ctx.call('tasks.tasks.getRest', {
            id: taskData.fullId,
          });
          await makeAssetNotIndexable({
            creator: { ...creator },
            assetId: taskDetail.asset.id,
            assetName: taskDetail.asset.name,
            ctx,
          });
        }
        tasks[key] = { ...taskData };

        ctx.logger.info(chalk`{cyan.bold BULK} Task ADDED: ${task.asset?.name}`);
        if (useCache) {
          await ctx.cache.set(
            phaseKey,
            `${LOAD_PHASES.TASKS}[${i + 1}/${tasksKeys.length}]`,
            60 * 60
          );
        }
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
