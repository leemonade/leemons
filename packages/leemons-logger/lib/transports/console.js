const { transports } = require('winston');
const format = require('../format');

module.exports = () => new transports.Console({ format: format({ colorized: true }) });
