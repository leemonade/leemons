const cluster = require('cluster');
const createLogger = require('../../index');
const console = require('./transports/Console');
const file = require('./transports/File');
const addPID = require('./format/addPID');
const EmitToMaster = require('./transports/EmitToMaster');

/**
 *
 * @returns {createLogger}
 */
module.exports = async () => {
  if (cluster.isMaster) {
    // Master logger, which will log to Console and File
    const logger = await createLogger({
      transports: async ({ id }) => [
        console(),
        await file({ id, folder: 'logs', filename: 'latest.log' }),
      ],
    });

    // When a worker sends a log, log it.
    cluster.on('message', (worker, message) => {
      if (message.type === 'log') {
        const log = message.data;
        logger[log.level](log);
      }
    });

    // Return the logger for Master process use
    return logger;
  }
  // Create a logger which proxies the log to master process
  return createLogger({ transports: () => [new EmitToMaster({ format: addPID() })] });
};
