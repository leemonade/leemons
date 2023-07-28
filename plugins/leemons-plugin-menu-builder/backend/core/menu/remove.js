const removeAll = require('../menu-item/removeAll');
const { validateNotExistMenu } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');

/**
 * Create a Menu
 * @public
 * @static
 * @param {string} key - A name to identify the Menu (just to admin it)
 * @param {any=} transacting DB Trasaction
 * @return {Promise<Menu>} Created / Updated menu
 * */
async function remove({ key, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistMenu({ key, ctx });

  await Promise.all([
    ctx.tx.db.Menu.deleteOne({ key }),
    ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: leemons.plugin.prefixPN('menu'),
        item: key,
      },
    }),
    removeAll({ menuKey: key, ctx }),
  ]);

  ctx.logger.info(`Deleted menu "${key}"`);

  return true;
}

module.exports = { remove };
