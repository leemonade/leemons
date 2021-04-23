const { format } = require('winston');
const colorize = require('./colorize');

const { combine, timestamp, splat } = format;
const prettyPrint = require('./prettyPrint');
const levelUppercase = require('./levelUppercase');

module.exports = ({ colorized = false } = {}) => {
  const formatters = [levelUppercase(), timestamp(), splat()];
  if (colorized) {
    formatters.push(colorize());
  }
  formatters.push(prettyPrint);
  return combine(...formatters);
};
