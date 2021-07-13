const getMenuBuilder = require('./getMenuBuilder');

async function addDashboard() {
  if (!(await menuItem.exist(mainMenuKey, prefixPN(menuData.item.key)))) {
    // eslint-disable-next-line no-await-in-loop
    await menuItem.add(
      {
        ...menuData.item,
        menuKey: mainMenuKey,
        key: prefixPN(menuData.item.key),
        parentKey: menuData.item.parentKey ? prefixPN(menuData.item.parentKey) : undefined,
      },
      menuData.permissions
    );
  }
}

module.exports = addDashboard;
