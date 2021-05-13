const { format } = require('winston');

const { printf } = format;

module.exports = printf(({ level, message, timestamp }) => `${timestamp} ${level} ${message}`);
