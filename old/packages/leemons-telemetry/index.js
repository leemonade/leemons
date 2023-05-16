const apm = require('elastic-apm-node');

const { start } = apm;
const { startTransaction } = apm;

// Overload apm.start to handle already started apm
apm.start = (name, options) => {
  if (!apm.isStarted()) {
    start.call(apm, {
      captureBody: 'all',
      logUncaughtExceptions: true,

      ...options,
      serviceName: name,
      // do not send to apm but remain active
      disableSend: process.env.leemons_telemetry !== 'true',
      serverUrl: 'https://apm.telemetry.leemons.io',
    });
  }
};

// Overload apm.startTransaction to use global transaction or parent if exists
apm.startTransaction = (name, parent) =>
  startTransaction.call(apm, name, {
    childOf: parent || global.appTransaction,
  });

module.exports = apm;
