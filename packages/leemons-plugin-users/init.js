const es = require('./src/i18n/es');
const en = require('./src/i18n/en');
const permissionService = require('./src/services/permissions');
const userService = require('./src/services/users');
const actionsService = require('./src/services/actions');
const { table } = require('./src/services/tables');
const { translations } = require('./src/services/translations');
const { addMain, addUsers, addProfiles, addWelcome } = require('./src/services/menu-builder');

async function init() {
  try {
    await actionsService.init();
    await permissionService.init();
    await userService.init();
  } catch (e) {}

  try {
    // Menu builder
    await addMain();
    await addWelcome();
    await addProfiles();
  } catch (e) {
    console.error(e);
  }

  if (translations()) {
    await translations().common.setManyByJSON(
      {
        es,
        en,
      },
      leemons.plugin.prefixPN('')
    );
  }

  /*
  console.log('Vamos a crear los items');
  leemons.log.info('Plugin users init OK');

  const generateVeryLongKey = () => {
    return global.utils.randomString(10000);
  };

  const generateNewMenuItemPermissionData = (data) => {
    return {
      center: data ? data.center : generateVeryLongKey(),
      menu: data ? data.menu : generateVeryLongKey(),
      user: data ? data.user : generateVeryLongKey(),
      menuItemKey: global.utils.randomString(10),
      action: 'view',
      type: leemons.plugin.prefixPN('menu-item'),
    };
  };

  const numberOfItemPermissionsToCreate = 1000000;
  const groups = 1000;
  const iterations = numberOfItemPermissionsToCreate / groups;

  let currentIterate;
  let lastItemPermissionData;
  let toSave = [];
  for (let i = 0; i < iterations; i++) {
    console.log(`${i + 1}/${iterations}`);
    console.time('Process data');
    currentIterate = generateNewMenuItemPermissionData();
    for (let x = 0; x < groups; x++) {
      lastItemPermissionData = generateNewMenuItemPermissionData(currentIterate);
      toSave.push({
        permissionName: leemons.plugin.prefixPN(
          `center:${lastItemPermissionData.center}.menu:${lastItemPermissionData.menu}.user:${lastItemPermissionData.user}.key:${lastItemPermissionData.menuItemKey}`
        ),
        actionName: lastItemPermissionData.action,
        type: lastItemPermissionData.type,
        item: lastItemPermissionData.menuItemKey,
        center: lastItemPermissionData.center,
      });
    }
    console.timeEnd('Process data');
    console.time('Create item permissions');
    await table.itemPermissions.createMany(toSave);
    console.timeEnd('Create item permissions');
    toSave = [];
  }

   */
}

module.exports = init;
