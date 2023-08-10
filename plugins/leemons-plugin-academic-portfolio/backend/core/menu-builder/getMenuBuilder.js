const { LeemonsError } = require('leemons-error');

async function getMenuBuilder({ ctx }) {
  // TODO Migration: Preguntar a Jaime si esta aproximación es válida o si no hace falta hacer tanta historia... y podemos pasar directamente de este método
  // const menu = leemons.getPlugin('menu-builder');
  // if (menu) return menu;
  // throw new Error(`Plugin 'menu-builder' need to be installed`);
  const constants = await ctx.tx.call('menu-builder.config.constants');
  if (!constants) throw new LeemonsError(`Plugin 'menu-builder' need to be installed`);
  return constants;
}

module.exports = getMenuBuilder;
