const { menuItems } = require('../config/constants');
const { findOne, update } = require('../src/services/settings');
const addMenuItems = require('../src/services/menu-builder/add');

module.exports = {
  findOne,
  update,
  initMenu: async () => {
    const [mainItem] = menuItems;
    await addMenuItems(mainItem);
  },
};
