const { validateKeyPrefix } = require('../../validations/exists');

/**
 * Remove a menu item
 * @private
 * @static
 * @param {string} menuKey - The Menu Item key
 * @param {any=} transacting DB transaction
 * @return {Promise<boolean>}
 * */
async function removeAll({ menuKey, ctx }) {
  validateKeyPrefix({ key: menuKey, calledFrom: ctx.callerPlugin, ctx });

  const promises = [
    // Delete item
    ctx.tx.db.MenuItem.deleteMany({ menuKey }),
    // Delete permissions of all items
    ctx.tx.call('users.permissions.removeItems', {
      query: {
        type: {
          $regex: new RegExp(`^${ctx.prefixPN(menuKey)}`, 'i'),
        },
      },
    }),
  ];

  // Delete translations of all items
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteKeyStartsWith', { key: ctx.prefixPN(`${menuKey}`) })
  );

  await Promise.all(promises);

  ctx.logger.info(`Deleted all menu items of menu "${menuKey}"`);

  return true;
}

module.exports = { removeAll };
