const getMenuBuilder = require('./getMenuBuilder');
const update = require('./update');
const { menuItems } = require('../../../config/constants');
const _ = require('lodash');

async function enableItem(key) {
  let menuItem = _.pickBy(menuItems, { item: { key } });
  menuItem = Object.values(menuItem)[0];
  const { item } = menuItem;

  if (item) {
    return update({
      ...item,
      disabled: false,
    });
  }
}

module.exports = enableItem;
