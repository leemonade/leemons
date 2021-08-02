function getMenuBuilder() {
  const menu = leemons.getPlugin('menu-builder');
  if (menu) return menu;
  throw new Error(`Plugin 'menu-builder' need to be installed`);
}

module.exports = getMenuBuilder;
