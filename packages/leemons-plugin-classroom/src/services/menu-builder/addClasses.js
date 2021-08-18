const add = require('./add');
const { menuItems } = require('../../../config/constants');

async function addClasses() {
  return add(menuItems.classes.item, menuItems.classes.permissions);
}

module.exports = addClasses;
