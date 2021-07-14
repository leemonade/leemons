const table = {
  menu: leemons.query('plugins_menu-builder::menu'),
  menuPermission: leemons.query('plugins_menu-builder::menu-permission'),
  menuItem: leemons.query('plugins_menu-builder::menu-item'),
  menuItemPermission: leemons.query('plugins_menu-builder::menu-item-permission'),
};

module.exports = { table };
