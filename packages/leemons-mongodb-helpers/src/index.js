const { mongoDBPaginate } = require('./mongoDBPaginate');
const { getKeyValueModel } = require('./key-value/getKeyValueModel');
const { getKey } = require('./key-value/getKey');
const { hasKey } = require('./key-value/hasKey');
const { setKey } = require('./key-value/setKey');
const { hasKeys } = require('./key-value/hasKeys');

module.exports = {
  mongoDBPaginate,
  getKeyValueModel,
  getKey,
  hasKey,
  setKey,
  hasKeys,
};
