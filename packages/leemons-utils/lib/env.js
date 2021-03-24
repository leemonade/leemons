const _ = require('lodash');

module.exports = {
  env: (key, defaultValue) => _.get(process.env, key, defaultValue),
};
