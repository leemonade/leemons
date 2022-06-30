const {
  transports,
  format: { combine },
} = require('winston');

const colorize = require('../format/colorize');
const defaultFormat = require('../format');
const prettyPrint = require('../format/prettyPrint');
const levelSameLength = require('../format/levelSameLength');

module.exports = (format = null) => {
  let _format = format;
  if (!format) {
    _format = combine(defaultFormat(), levelSameLength(), colorize(), prettyPrint);
  }
  return new transports.Console({ format: _format });
};
