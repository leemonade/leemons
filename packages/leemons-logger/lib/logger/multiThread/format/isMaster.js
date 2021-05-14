const { format } = require('winston');
const cluster = require('cluster');

module.exports = format((info) => {
  // f stands for format
  const f = { ...info };
  f.labels.isMaster = f.labels.pid === process.pid && cluster.isMaster;

  return f;
});
