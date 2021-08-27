const _ = require('lodash');
const update = require('./update');
const { menuItems } = require('../../../config/constants');

async function enableItem(key) {
  const [menuItem] = _.pickBy(menuItems, { item: { key } });
  const { item } = menuItem;

  if (item) {
    return update({
      ...item,
      disabled: false,
    });
  }
  return null;
}

module.exports = enableItem;
