require('leemons-telemetry').start(process.env.leemons_telemetry_name ?? 'Leemons App');

const { getAvailablePort } = require('leemons-utils/lib/port');
const createLogger = require('leemons-logger');
const leemons = require('../index');

// $ leemons start
module.exports = async ({ level: logLevel = 'debug' }) => {
  const logger = await createLogger();
  logger.level = logLevel;

  const PORT = await getAvailablePort();
  process.env.NODE_ENV = 'production';
  process.env.PORT = PORT;

  const leemonsInstance = leemons(logger);

  leemonsInstance.start();
};
