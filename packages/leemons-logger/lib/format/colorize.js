const { format } = require('winston');

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
};

module.exports = format((info) => {
  const f = colorize({ colors }).transform(info, {});
  if (f.timestamp) {
    f.timestamp = chalk`{${colors.timestamp} ${f.timestamp}}`;
  }
  return { ...f };
});
