const { format } = require('winston');
const colorize = require('./colorize');

const { combine, timestamp, splat, uncolorize } = format;
const prettyPrint = require('./prettyPrint');
const levelUppercase = require('./levelUppercase');

module.exports = ({ colorized = false } = {}) => {
  const formatters = [levelUppercase(), timestamp(), splat()];
  if (colorized) {
    // Add custom colors
    formatters.push(colorize());
  } else {
    // Remove possible existing colors
    formatters.push(uncolorize());
  }
  formatters.push(prettyPrint);
  return combine(...formatters);
};
