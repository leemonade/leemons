const getMenuBuilder = require('./getMenuBuilder');

async function update(item) {
  const menuBuilder = getMenuBuilder();
  const { menuItem, config } = menuBuilder.services;
  const { key, ...data } = item;
  if (await menuItem.exist(config.constants.mainMenuKey, key)) {
    return menuItem.update(config.constants.mainMenuKey, key, data);
  }
  return null;
}

module.exports = update;
