const objTest = {
  permissionName: 'plugins.users.users',
  actionNames: ['view', 'update'],
  item: 'una-id-cualquiera',
  type: 'plugins.dataset-test.menu-item',
};

async function add() {
  try {
    console.log('---- Start add ----');
    const { item, type, ...obj } = objTest;
    const data = await leemons.getPlugin('users').services.permissions.addItem(item, type, obj);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End add ----');
}

async function find() {
  try {
    console.log('---- Start find ----');
    const data = await leemons
      .getPlugin('users')
      .services.permissions.findItems({ type: objTest.type });
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End find ----');
}

async function remove() {
  try {
    console.log('---- Start remove ----');
    const data = await leemons.getPlugin('users').services.permissions.removeItems(objTest);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End remove ----');
}

async function init() {
  await add();
  await find();
  await remove();
}

module.exports = init;
