const getMenuBuilder = require('./getMenuBuilder');

async function remove(key) {
  const { menuItem, config } = getMenuBuilder().services;
  return menuItem.remove(config.constants.mainMenuKey, key);
}

module.exports = remove;
