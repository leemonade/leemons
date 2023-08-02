const { validateNotExistMenuItem } = require('../../validations/exists');
const { validateKeyPrefix } = require('../../validations/exists');

/**
 * Remove a menu item
 * @private
 * @static
 * @param {string} menuKey - The Menu Item key
 * @param {string} key - The Menu Item key
 * @param {any=} transacting DB transaction
 * @return {Promise<boolean>}
 * */
async function remove({ menuKey, key, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  // Check if the MENU ITEM not exists
  await validateNotExistMenuItem({ menuKey, key, ctx });

  const promises = [
    // Delete item
    ctx.tx.db.MenuItem.deleteOne({ key }),
    // Delete item permissions
    ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: leemons.plugin.prefixPN(`${menuKey}.menu-item`),
        item: key,
      },
    }),
  ];

  // Delete item translations
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteKeyStartsWith', {
      key: ctx.prefixPN(`${menuKey}.${key}.`),
    })
  );

  await Promise.all(promises);

  ctx.logger.info(`Deleted menu item "${key}" of menu "${menuKey}"`);

  return true;
}

module.exports = { remove };
