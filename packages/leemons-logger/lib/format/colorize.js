const { format } = require('winston');
const _ = require('lodash');

const { colorize } = format;
const chalk = require('chalk');

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'blue',
  http: 'green',
  verbose: 'gray',
  debug: 'yellow bold',
  silly: 'magenta',
  timestamp: 'gray',
  labels: 'magenta',
};

module.exports = format((info) => {
  const f = colorize({ colors }).transform(info, {});
  if (f.timestamp) {
    f.timestamp = chalk`{${colors.timestamp} ${f.timestamp}}`;
  }
  if (f.labels) {
    f.labels = _.fromPairs(
      _.entries(f.labels).map(([key, value]) => [key, chalk`{${colors.labels} ${value}}`])
    );
  }
  return { ...f };
});
