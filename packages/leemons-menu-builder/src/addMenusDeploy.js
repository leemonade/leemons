const _ = require('lodash');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');

async function exec({ keyValueModel, menu, ctx }) {
  if (
    !(await hasKey(keyValueModel, `menu-${menu.key}`)) ||
    process.env.RELOAD_MENUS_ON_EVERY_INSTALL === 'true'
  ) {
    if (
      !(await ctx.tx.call('menu-builder.menu.exist', {
        key: menu.key,
      }))
    ) {
      await ctx.tx.call('menu-builder.menu.add', menu);
      await setKey(keyValueModel, `menu-${menu.key}`);
    }
  }
  ctx.tx.emit(`init-menu-${menu.key}`);
}

/**
 * menu = {key: string, permissions: any}
 */
async function addMenusDeploy({ keyValueModel, menu, ctx }) {
  const menus = _.isArray(menu) ? menu : [menu];

  await Promise.all(_.map(menus, (l) => exec({ keyValueModel, menu: l, ctx })));
}

module.exports = { addMenusDeploy };
