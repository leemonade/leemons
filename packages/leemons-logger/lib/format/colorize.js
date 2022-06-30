const { format } = require('winston');
const _ = require('lodash');

const chalk = require('chalk');

const colors = {
  error: 'red',
  warn: 'rgb(255, 165, 0)',
  info: 'blue',
  http: 'green',
  verbose: 'gray',
  debug: 'yellow.bold',
  silly: 'magenta',
  timestamp: 'gray',
  labels: 'magenta',
};

module.exports = format((info) => {
  const f = _.cloneDeep(info);

  if (f.level) {
    f.level = chalk`{${colors[f.level.trim().toLowerCase()]} ${f.level}}`;
  }
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

module.exports.colors = colors;
