const getMenuBuilder = require('./getMenuBuilder');
const { pluginName } = require('../../../config/constants');

async function update(item) {
  const menuBuilder = getMenuBuilder();
  const { menuItem, config } = menuBuilder.services;
  const { key, parentKey, ...data } = item;
  const payload = {
    ...data,
    menuKey: config.constants.mainMenuKey,
    key: leemons.plugin.prefixPN(key),
    parentKey: parentKey ? leemons.plugin.prefixPN(parentKey) : undefined,
    pluginName,
  };

  return menuItem.update(config.constants.mainMenuKey, leemons.plugin.prefixPN(key), payload);
}

module.exports = update;
