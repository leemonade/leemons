function getMenuBuilder() {
  if (leemons.plugins['menu-builder']) return leemons.plugins['menu-builder'];
  throw new Error(`Plugin 'menu-builder' need to be installed`);
}

module.exports = getMenuBuilder;
