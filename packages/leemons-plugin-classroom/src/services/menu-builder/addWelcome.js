const add = require('./add');
const { menuItems } = require('../../../config/constants');

async function addWelcome() {
  return add(menuItems.welcome.item, menuItems.welcome.permissions);
}

module.exports = addWelcome;
