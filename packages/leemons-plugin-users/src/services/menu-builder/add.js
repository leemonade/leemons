const getMenuBuilder = require('./getMenuBuilder');
const prefixPN = require('../../helpers/prefixPN');

async function add(item, permissions) {
  const menuBuilder = getMenuBuilder();
  const { menuItem } = menuBuilder.services;
  const { mainMenuKey } = menuBuilder.config.constants;
  if (!(await menuItem.exist(mainMenuKey, prefixPN(item.key)))) {
    // eslint-disable-next-line no-await-in-loop
    await menuItem.add(
      {
        ...item,
        menuKey: mainMenuKey,
        key: prefixPN(item.key),
        parentKey: item.parentKey ? prefixPN(item.parentKey) : undefined,
      },
      permissions
    );
  }
}

module.exports = add;
