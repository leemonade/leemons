const {
  format: { combine },
} = require('winston');
const defaultFormat = require('../../../format');
const levelSameLength = require('../../../format/levelSameLength');
const colorize = require('../../../format/colorize');
const prettyPrint = require('../../../format/prettyPrint');

const Console = require('../../../transports/console');
const addPID = require('../format/addPID');
const isMaster = require('../format/isMaster');

module.exports = () =>
  Console(
    combine(defaultFormat(), levelSameLength(), addPID(), isMaster(), colorize(), prettyPrint)
  );
