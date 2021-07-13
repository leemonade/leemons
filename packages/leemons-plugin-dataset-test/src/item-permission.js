const objTest = {
  permissionName: 'plugins.users.users',
  actionNames: ['view', 'update'],
  item: 'una-id-cualquiera',
  type: 'plugins.dataset-test.menu-item',
};

async function add() {
  try {
    console.log('---- Start add ----');
    const data = await leemons.plugins.users.services.itemPermissions.add(objTest);
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End add ----');
}

async function find() {
  try {
    console.log('---- Start find ----');
    const data = await leemons.plugins.users.services.itemPermissions.find({ type: objTest.type });
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  console.log('---- End find ----');
}

async function remove() {
  try {
    console.log('---- Start remove ----');
    const data = await leemons.plugins.users.services.itemPermissions.remove(objTest);
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
