const getMenuBuilder = require('./getMenuBuilder');

async function add(item, permissions) {
  const menuBuilder = getMenuBuilder();
  const { menuItem } = menuBuilder.services;
  const { mainMenuKey } = menuBuilder.config.constants;
  if (!(await menuItem.exist(mainMenuKey, leemons.plugin.prefixPN(item.key)))) {
    return menuItem.add(
      {
        ...item,
        menuKey: mainMenuKey,
        key: leemons.plugin.prefixPN(item.key),
        parentKey: item.parentKey ? leemons.plugin.prefixPN(item.parentKey) : undefined,
      },
      permissions
    );
  }
  return null;
}

module.exports = add;
