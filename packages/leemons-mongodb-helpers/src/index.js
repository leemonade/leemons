/* eslint-disable global-require */

module.exports = {
  ...require('./mongoDBPaginate'),
  ...require('./key-value/getKeyValueModel'),
  ...require('./key-value/getKey'),
  ...require('./key-value/hasKey'),
  ...require('./key-value/setKey'),
  ...require('./key-value/hasKeys'),
};
