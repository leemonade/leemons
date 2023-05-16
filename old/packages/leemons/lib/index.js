require('leemons-telemetry').start(process.env.leemons_telemetry_name ?? 'Leemons App');

const leemons = require('./leemons');

module.exports = leemons;
