const getMenuBuilder = require('./getMenuBuilder');
const { pluginName } = require('../../config/constants');

async function update({ ctx, ...item }) {
  const constants = await getMenuBuilder();

  const { key, parentKey, ...data } = item;
  const payload = {
    ...data,
    menuKey: constants.mainMenuKey,
    key: ctx.prefixPN(key),
    parentKey: parentKey ? ctx.prefixPN(parentKey) : undefined,
    pluginName,
  };

  // return menuItem.update(config.constants.mainMenuKey, leemons.plugin.prefixPN(key), payload);
  return ctx.tx.call('menu-builder.menuItem.update', {
    // menuKey: constants.mainMenuKey,
    // key: ctx.prefixPN(key),
    ...payload,
  });
}

module.exports = update;
