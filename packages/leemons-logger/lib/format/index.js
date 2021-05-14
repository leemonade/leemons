const { format } = require('winston');

const { combine, timestamp, splat } = format;
const levelUppercase = require('./levelUppercase');

module.exports = () => {
  const formatters = [levelUppercase(), timestamp(), splat()];
  return combine(...formatters);
};
