const getMenuBuilder = require('./getMenuBuilder');

async function update(item) {
  const menuBuilder = getMenuBuilder();
  const { menuItem, config } = menuBuilder.services;
  const { key, parentKey, ...data } = item;
  const payload = {
    ...data,
    menuKey: config.constants.mainMenuKey,
    key: leemons.plugin.prefixPN(key),
    parentKey: parentKey ? leemons.plugin.prefixPN(parentKey) : undefined,
    pluginName: 'plugins.classroom',
  };

  return menuItem.update(config.constants.mainMenuKey, leemons.plugin.prefixPN(key), payload);
}

module.exports = update;
