const { format } = require('winston');

module.exports = format(({ level, ...rest }) => ({
  level: level.padEnd('verbose'.length),
  ...rest,
}));
