const winston = require('winston');
const transports = require('./transports');

const logger = winston.createLogger({
  transports,
});

module.exports = logger;
