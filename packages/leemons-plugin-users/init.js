const permissionService = require('./src/services/permissions');
// const roleService = require('./services/private/roles');
const userService = require('./src/services/users');
const actionsService = require('./src/services/actions');
const constants = require('./config/constants');
const prefixPN = require('./src/helpers/prefixPN');

async function init() {
  await actionsService.init();
  await permissionService.init();
  // await roleService.init();
  await userService.init();

  if (leemons.plugins['menu-builder']) {
    const { menuItem } = leemons.plugins['menu-builder'].services;
    const { mainMenuKey } = leemons.plugins['menu-builder'].config.constants;

    let menuData;
    for (let i = 0, l = constants.defaultMainMenuItems.length; i < l; i++) {
      menuData = constants.defaultMainMenuItems[i];
      // eslint-disable-next-line no-await-in-loop
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
  }
  leemons.log.info('Plugin users init OK');
}

module.exports = init;
