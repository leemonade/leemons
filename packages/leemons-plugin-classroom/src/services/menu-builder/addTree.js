const add = require('./add');
const { menuItems } = require('../../../config/constants');

async function addTree() {
  return add(menuItems.tree.item, menuItems.tree.permissions);
}

module.exports = addTree;
