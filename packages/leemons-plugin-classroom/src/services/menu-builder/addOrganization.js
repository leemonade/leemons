const add = require('./add');
const { menuItems } = require('../../../config/constants');

async function addOrganization() {
  return add(menuItems.organization.item, menuItems.organization.permissions);
}

module.exports = addOrganization;
