const { addMenusDeploy } = require('./addMenusDeploy');
const { updateMenuItem } = require('./updateMenuItem');
const { addMenuItemsDeploy } = require('./addMenuItemsDeploy');

module.exports = {
  mainMenuKey: 'menu-builder.main',
  addMenusDeploy,
  updateMenuItem,
  addMenuItemsDeploy,
};
