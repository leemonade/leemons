const { addMenuItemsDeploy } = require('./addMenuItemsDeploy');
const { addMenusDeploy } = require('./addMenusDeploy');
const { updateMenuItem } = require('./updateMenuItem');

module.exports = {
  mainMenuKey: 'menu-builder.main',
  addMenusDeploy,
  updateMenuItem,
  addMenuItemsDeploy,
};
