/* eslint-disable no-param-reassign */
const { isEmpty } = require('lodash');
const update = require('./update');
const { menuItems } = require('../../../config/constants');

async function enableItem(key, item) {
  try {
    if (isEmpty(item)) {
      const menuItem = menuItems.find(({ item: _item }) => _item.key === key);
      item = menuItem?.item;
    }

    if (!isEmpty(item)) {
      return update({
        ...item,
        disabled: false,
      });
    }

    return null;
  } catch (e) {
    throw new Error(`No menuItem with the key ${key} was found`);
  }
}

module.exports = enableItem;
