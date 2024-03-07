const _ = require('lodash');
const { validateKeyPrefix } = require('../../validations/exists');
const { validateExistMenu } = require('../../validations/exists');

/**
 * Create a Menu
 * @public
 * @static
 * @param {string} key - A name to identify the Menu (just to admin it)
 * @param {MenuPermissionsAdd} permissions Permissions for Menu
 * @param {any=} transacting DB Trasaction
 * @return {Promise<Menu>} Created / Updated menu
 * */
async function add({ key, permissions, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateExistMenu({ key, ctx });

  const menuDoc = await ctx.tx.db.Menu.create({ key });
  const menu = menuDoc.toObject();

  // Add the necessary permissions to view the item
  if (_.isArray(permissions) && permissions.length) {
    await ctx.tx.call('users.permissions.addItem', {
      item: key,
      type: ctx.prefixPN('menu'),
      data: permissions,
    });
  }

  ctx.logger.debug(`Added menu "${key}"`);

  return menu;
}

module.exports = { add };
