/* eslint-disable global-require */

const { localeRegex, localeRegexString } = require('./validations/localeCode');

module.exports = {
  ...require('./validator'),
  ...require('./types'),
  localeRegex,
  localeRegexString,
};
