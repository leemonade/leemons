const key = 'plugins.dataset-test.sidebar-menu';
const permissions = [
  {
    permissionName: 'plugins.users.users',
    actionNames: ['view', 'update'],
  },
];

async function add() {
  try {
    console.log('---- Start add ----');
    const data = await leemons.getPlugin('menu-builder').services.menu.add(key, permissions);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End add ----');
}

async function remove() {
  try {
    console.log('---- Start remove ----');
    const data = await leemons.plugins['menu-builder'].services.menu.remove(key);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End remove ----');
}

async function init() {
  await add();
  await remove();
}

module.exports = init;
