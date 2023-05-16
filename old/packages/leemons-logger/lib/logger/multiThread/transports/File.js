const {
  format: { combine, uncolorize },
} = require('winston');
const file = require('../../../transports/file');
const defaultFormat = require('../../../format');
const addPID = require('../format/addPID');
const isMaster = require('../format/isMaster');

module.exports = (value = {}) =>
  file({ ...value, format: () => combine(defaultFormat(), uncolorize(), addPID(), isMaster()) });
