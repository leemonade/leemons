/* eslint-disable no-await-in-loop */
const chalk = require('chalk');
const { keys } = require('lodash');
const _delay = require('./bulk/helpers/delay');
const { LOAD_PHASES } = require('./importHandlers/getLoadStatus');
const importModules = require('./bulk/modules');

async function initModules({ file, config, ctx, useCache, phaseKey }) {
  try {
    const modules = await importModules({ filePath: file, config, ctx });

    const moduleKeys = keys(modules);

    for (let i = 0, len = moduleKeys.length; i < len; i++) {
      const key = moduleKeys[i];
      const { creator, ...module } = modules[key];

      try {
        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Adding module: ${module.asset?.name}}`);
        const { module: moduleData } = await ctx.call(
          'learning-paths.modules.createRest',
          { ...module, published: true },
          { meta: { userSession: creator } }
        );

        modules[key] = { ...moduleData };

        ctx.logger.info(chalk`{cyan.bold BULK} Module ADDED: ${module.asset?.name}`);
        if (useCache) {
          await ctx.cache.set(
            phaseKey,
            `${LOAD_PHASES.MODULES}[${i + 1}/${moduleKeys.length}]`,
            60 * 60
          );
        }
      } catch (e) {
        ctx.logger.log('-- MODULE CREATION ERROR --');
        ctx.logger.log(`module: ${module.asset?.name}`);
        ctx.logger.log(`creator: ${creator.name}`);
        ctx.logger.error(e);
      }

      await _delay(3000);
    }

    return modules;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initModules;
