const { format } = require('winston');

const { combine, timestamp, splat } = format;
const levelUppercase = require('./levelUppercase');
const removeSplat = require('./removeSplat');

module.exports = () => {
  const formatters = [levelUppercase(), timestamp(), splat(), removeSplat()];
  return combine(...formatters);
};
