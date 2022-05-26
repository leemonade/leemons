const getMenuBuilder = require('./getMenuBuilder');

async function add(item, permissions, isCustomPermission, { transacting } = {}) {
  const menuBuilder = getMenuBuilder();
  const { menuItem, config } = menuBuilder.services;
  if (!(await menuItem.exist(config.constants.mainMenuKey, leemons.plugin.prefixPN(item.key)))) {
    return menuItem.add(
      {
        ...item,
        menuKey: config.constants.mainMenuKey,
        key: leemons.plugin.prefixPN(item.key),
      },
      permissions,
      { isCustomPermission, transacting }
    );
  }
  return null;
}

module.exports = { add };
