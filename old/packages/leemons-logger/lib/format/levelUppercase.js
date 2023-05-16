const { format } = require('winston');

module.exports = format(({ level, ...rest }) => ({
  level: level.toUpperCase(),
  ...rest,
}));
