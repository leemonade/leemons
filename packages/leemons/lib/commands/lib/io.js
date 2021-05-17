const cluster = require('cluster');
const chalk = require('chalk');
const { createWorker } = require('./worker');

function handleStdin(PORT, logger) {
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (data) => {
    switch (data.toString().trim()) {
      case 'restart':
      case 'reload':
      case 'rs':
        logger.info(chalk`{magenta Reloading Leemons App\n}`);
        Object.values(cluster.workers).forEach((worker) => {
          worker.send('kill');
        });
        createWorker({ PORT });
        break;
      default:
    }

    if (data.charCodeAt(0) === 12) {
      logger.silly('Console cleared');
      // eslint-disable-next-line no-console
      console.clear();
    }
  });
}

module.exports = { handleStdin };
