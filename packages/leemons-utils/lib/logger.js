const pino = require('pino');

const logger = pino({ prettyPrint: true });

module.exports = logger;
