const _ = require('lodash');
const getMenuBuilder = require('./getMenuBuilder');

async function remove(key) {
  const { menuItem, config } = getMenuBuilder().services;
  const keys = _.isArray(key) ? key : [key];
  return Promise.allSettled(
    _.map(keys, (k) => menuItem.remove(config.constants.mainMenuKey, leemons.plugin.prefixPN(k)))
  );
}

module.exports = remove;
