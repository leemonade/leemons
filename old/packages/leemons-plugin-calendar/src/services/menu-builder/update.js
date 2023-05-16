const getMenuBuilder = require('./getMenuBuilder');

async function update(item, permissions) {
  const menuBuilder = getMenuBuilder();
  const { menuItem, config } = menuBuilder.services;
  if (await menuItem.exist(config.constants.mainMenuKey, leemons.plugin.prefixPN(item.key))) {
    return menuItem.update(
      config.constants.mainMenuKey,
      leemons.plugin.prefixPN(item.key),
      {
        ...item,
        menuKey: config.constants.mainMenuKey,
        key: leemons.plugin.prefixPN(item.key),
      },
      permissions
    );
  }
  return null;
}

module.exports = { update };
