const getMenuBuilder = require('./getMenuBuilder');

async function add(item, permissions) {
  const menuBuilder = getMenuBuilder();
  const { menuItem, config } = menuBuilder.services;
  if (!(await menuItem.exist(config.constants.mainMenuKey, leemons.plugin.prefixPN(item.key)))) {
    return menuItem.add(
      {
        ...item,
        menuKey: config.constants.mainMenuKey,
        key: leemons.plugin.prefixPN(item.key),
        parentKey: item.parentKey ? leemons.plugin.prefixPN(item.parentKey) : undefined,
      },
      permissions
    );
  }
  return null;
}

module.exports = add;
