const constants = require('../../config/constants');
const { validateNotExistMenuItem } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');
const { validateNotExistMenu } = require('../../validations/exists');

/**
 * Update a Menu Item
 * @private
 * @static
 * @param {string} menuKey - Menu key
 * @param {string} key - Menu item key
 * @param {MenuItemAdd} data - The Menu Item to update
 * @param {MenuPermissionsAdd=} permissions Permissions for Menu Item
 * @param {any=} transacting DB transaction
 * @return {Promise<MenuItem>} Created / Updated menuItem
 * */
async function enable({ menuKey = constants.mainMenuKey, key, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  // Check for required params
  await validateNotExistMenu({ key: menuKey, ctx });

  // Check if the MENU ITEM exists
  await validateNotExistMenuItem({ menuKey, key, ctx });

  const menuItem = await ctx.tx.db.MenuItem.findOneAndUpdate(
    { menuKey, key },
    { disabled: false },
    { new: true, lean: true }
  );

  ctx.logger.info(`Enabled menu item "${key}" of menu "${menuKey}"`);

  return menuItem;
}

module.exports = { enable };
