const winston = require('winston');
// const _ = require('lodash');
const transports = require('./transports');

module.exports = () => {
  const logger = winston.createLogger({
    transports: transports(),
  });

  return logger;
  // return _.pick(logger, [
  //   'profile',
  //   'startTimer',
  //   'level',
  //   'on',
  //   ...Object.keys(winston.config.npm.levels),
  // ]);
};
