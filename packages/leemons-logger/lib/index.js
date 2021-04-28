const winston = require('winston');
const _ = require('lodash');
const { v4: uuid } = require('uuid');
const transports = require('./transports');

module.exports = async ({ id = uuid() } = {}) => {
  const logger = winston.createLogger({
    transports: await transports({ id }),
  });

  logger.id = id;

  // Get the desired methods only
  const log = _.fromPairs(
    Object.entries(
      _.pick(logger, [
        'id',
        'profile',
        'startTimer',
        'on',
        ...Object.keys(winston.config.npm.levels),
      ])
      // Bind the methods to the logger (required by winston)
    ).map(([key, value]) => {
      if (_.isFunction(value)) {
        return [key, value.bind(logger)];
      }
      return [key, value];
    })
  );

  Object.defineProperty(log, 'level', {
    set(value) {
      logger.level = value;
    },
    get() {
      return logger.level;
    },
  });

  // Return as object
  return log;
};
