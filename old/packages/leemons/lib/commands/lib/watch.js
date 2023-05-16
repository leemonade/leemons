const chokidar = require('chokidar');
const chalk = require('chalk');

/**
 * Watches the files in the given dirs (with Chokidar) and calls the handler
 * when a file is added, modified or deleted.
 *
 * The event is not triggered immediately, as it waits for changes to stop
 * occurring, thus avoiding unnecessary processing.
 *
 * @param {{name: string, dirs: string[], config: chokidar.WatchOptions, handler: () => Promise<void>, logger: Logger}} settings
 *
 * @param {string} settings.name The watcher name (used for logs)
 * @param {string[]} settings.dirs The directories to watch (See https://github.com/micromatch/picomatch)
 * @param {chokidar.WatchOptions} settings.config The chokidar config (See https://github.com/paulmillr/chokidar#persistence)
 * @param {() => Promise<void>} settings.handler The handler is called when a change event occurs.
 * @param {Logger} settings.logger The logger to use when a change event occurs
 *
 * @returns {chokidar.FSWatcher} Returns the created watcher
 */
function createReloader({ name, dirs, config, handler, logger } = {}) {
  let isReloading = false;
  let requestedReloads = 0;
  let lastTimer = null;

  const watcher = chokidar.watch(dirs, config);

  const watcherHandler = (event, filename) => {
    requestedReloads++;

    const handledRequests = requestedReloads;

    const timer = setTimeout(() => {
      if (lastTimer !== timer) {
        clearTimeout(timer);
        return;
      }

      if (!isReloading) {
        isReloading = true;
        logger.info(chalk`Reloading ${name} due to {magenta ${handledRequests}} changes`);
        handler().then(() => {
          requestedReloads -= handledRequests;
          logger.info(
            chalk`Reloaded ${name} due to {magenta ${handledRequests} changes}. {red ${requestedReloads} changes remaining}`
          );
          if (lastTimer === timer) {
            lastTimer = null;
          }
          if (requestedReloads < 0) {
            requestedReloads = 0;
          } else if (requestedReloads > 0 && lastTimer != null) {
            requestedReloads--;
            watcherHandler(event, filename);
          }
          isReloading = false;
        });
      }
    }, 500);

    lastTimer = timer;
  };

  watcher.on('all', watcherHandler);

  return watcher;
}

module.exports = { createReloader };
