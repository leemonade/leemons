const add = require('./add');
const { menuItems } = require('../../../config/constants');

async function addMain() {
  return add(menuItems.main.item, menuItems.main.permissions);
}

module.exports = addMain;
